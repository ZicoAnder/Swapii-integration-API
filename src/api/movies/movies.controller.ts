import { NextFunction, Request, Response } from "express";
import { UniversalsController } from "../../@core/common/universals.controller";
import { MoviesService } from "./movies.service";

export class MoviesController extends UniversalsController {
  public fetchMoviesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { ip, method, originalUrl, body } = req;
    try {
      const response = await new MoviesService().fetchMoviesService({ ip, method, originalUrl }, body);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

  public fetchMoviesCharactersController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new MoviesService().fetchMovieCharacters(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

  public addMovieCommentController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ip, method, originalUrl, body} = req;
      const response = await new MoviesService().addMovieCommentService({ip, method, originalUrl}, body);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

  public fetchMovieCommentController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new MoviesService().fetchMovieCommentService(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

}
