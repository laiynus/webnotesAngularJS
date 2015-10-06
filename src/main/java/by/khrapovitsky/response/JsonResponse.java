package by.khrapovitsky.response;


public class JsonResponse {

    private String status = "";
    private String errorMessage = "";
    private Object object;

    public JsonResponse(String status, String errorMessage) {
        this.status = status;
        this.errorMessage = errorMessage;
    }

    public JsonResponse(String status, String errorMessage,Object object) {
        this.status = status;
        this.errorMessage = errorMessage;
        this.object = object;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Object getObject() {
        return object;
    }

    public void setObject(Object object) {
        this.object = object;
    }
}
