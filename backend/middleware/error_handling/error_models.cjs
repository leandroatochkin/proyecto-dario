class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.status = 404;
      this.code = 'NOT_FOUND';
    }
  }
  
  class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.status = 400;
      this.code = 'VALIDATION_ERROR';
    }
  }

  class ConflictError extends Error {
    constructor(message) {
      super(message);
      this.status = 409;
      this.code = 'CONFLICT_ERROR';
    }
  }

  class ServerError extends Error {
    constructor(message) {
      super(message);
      this.status = 500;
      this.code = 'SERVER_ERROR';
    }
  }
  

  module.exports = {NotFoundError, ValidationError,  ConflictError, ServerError};
