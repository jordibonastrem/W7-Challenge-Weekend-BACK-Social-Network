const { ValidationError } = require("express-validation");
const { notFoundErrorHandler, generalErrorHandler } = require("./error");

const mockReq = () => {
  const req = {};
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Given a notFoundErrorHandler middleware", () => {
  describe("When it receives a request", () => {
    test("Then it should send a response with a status code of 404 and a message of Endpoint not found", () => {
      const req = mockReq();
      const res = mockResponse();
      const expectedError = { error: "Endpoint not found" };

      notFoundErrorHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a generalErrorHandler middleware", () => {
  describe("When it recieves a request and no error", () => {
    test("Then it should send a error with code 500 and a message 'General error'", () => {
      const req = mockReq();
      const res = mockResponse();
      const next = () => {};
      const expectedError = { error: "General error" };

      generalErrorHandler(expectedError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it recievesa request with a ValidationError", () => {
    test("Then it should send an error with code 400 and a message of 'Bad request'", () => {
      const req = mockReq();
      const res = mockResponse();
      const next = () => {};
      const expectedError = new ValidationError("details", {
        error: new Error(),
        statusCode: 400,
      });

      generalErrorHandler(expectedError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Bad request" });
    });
  });
});
