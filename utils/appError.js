class AppError extends Error{
    constructor(){
        super();
    }

    create (message , statusCode , errorStatus) {
        this.message = message;
        this.statusCode = statusCode;
        this.errorStatus = errorStatus;
        return this;
    }
}

module.exports = new AppError();// Create a new object