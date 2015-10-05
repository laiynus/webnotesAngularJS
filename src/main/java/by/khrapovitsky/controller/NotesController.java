package by.khrapovitsky.controller;

import by.khrapovitsky.model.JsonResponse;
import by.khrapovitsky.model.Note;
import by.khrapovitsky.model.User;
import by.khrapovitsky.service.NotesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;

@Controller
@RequestMapping(value = {"/notes"})
public class NotesController {

    @Autowired
    private NotesService notesService;
    
    @RequestMapping(method = RequestMethod.GET)
    public ModelAndView defaultPage() {
        ModelAndView model = new ModelAndView();
        model.setViewName("notes");
        return model;
    }

    @Secured("isAuthenticated()")
    @RequestMapping(value = "addNote", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody JsonResponse addNote(@RequestBody Note note) throws IOException {
        if(note.getNote() == null || note.getNote().isEmpty()){
            return new JsonResponse("Error","Note can't be empty!");
        }else{
            if(note.getNote().length()>5000){
                return new JsonResponse("Error","The maximum note length is 1000 characters!");
            }else{
                note.setUser(new User(SecurityContextHolder.getContext().getAuthentication().getName(), null));
                note.setDateTimeCreate(new Timestamp(new java.util.Date().getTime()));
                notesService.insert(note);
                return new JsonResponse("Ok","",note);
            }
        }
    }

    @Secured("isAuthenticated()")
    @RequestMapping(value = "getLastNotes",method = RequestMethod.GET)
    public @ResponseBody List getLastNotes(){
        return notesService.getLastUserNotes(new User(SecurityContextHolder.getContext().getAuthentication().getName(), null));
    }

    @Secured("isAuthenticated()")
    @RequestMapping(value = "getAllNotes",method = RequestMethod.GET)
    public @ResponseBody List getAllNotes(){
        return notesService.getUserNotes(new User(SecurityContextHolder.getContext().getAuthentication().getName(), null));
    }

    @Secured("isAuthenticated()")
    @RequestMapping(value = "deleteNote",method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE,consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody JsonResponse deleteNote(@RequestBody Note tmpNote) {
        Note note = notesService.getNoteWithUser(tmpNote.getId());
        if (note != null) {
            if (note.getUser().getUsername().equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
                notesService.delete(note);
                return new JsonResponse("Ok","");
            }else{
               return new JsonResponse("Error","Access denied!");
            }
        }
        return new JsonResponse("Error","This note is not found!");
    }

    @Secured("isAuthenticated()")
    @RequestMapping(value = "editNote",method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE,consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody JsonResponse editNote(@RequestBody Note note) {
        if(note.getNote() == null || note.getNote().isEmpty()){
            return new JsonResponse("Error","Note can't be empty!");
        }else {
            if(note.getNote().length()>5000){
                return new JsonResponse("Error","The maximum note length is 5000 characters!");
            }else {
                Note tmpNote = notesService.getNoteWithUser(note.getId());
                if (tmpNote != null) {
                    if (tmpNote.getUser().getUsername().equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
                        tmpNote.setDateTimeCreate(new Timestamp(new java.util.Date().getTime()));
                        tmpNote.setNote(note.getNote());
                        notesService.update(tmpNote);
                        return new JsonResponse("Ok","",tmpNote);
                    } else {
                        return new JsonResponse("Error","Access denied!");
                    }
                }
            }
        }
        return new JsonResponse("Error","This note is not found!");
    }

    @Secured("isAuthenticated()")
    @RequestMapping(value = "getNote",method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE,consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody JsonResponse getNote(@RequestBody Note note) {
        if (notesService.getNote(note.getId()) != null) {
            if (notesService.getNoteWithUser(note.getId()).getUser().getUsername().equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
                return new JsonResponse("Ok","",notesService.getNote(note.getId()));
            }
        }
        return new JsonResponse("Error","This note is not found!");
    }

}
