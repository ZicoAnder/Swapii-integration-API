import { IResponse } from "../../@core/interfaces/response";
import { UniversalsService } from "../../@core/common/universals.service";
import { config } from "secreta";
import MovieComment from "./movies.model";
import logger from "../../util/logger/logger";
import { Request } from "express";
import { ICharacter } from "../../@core/interfaces/character";
import { Op } from "sequelize";

const { SWAPI_BASE_URL } = config;
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

export class MoviesService extends UniversalsService {

  public fetchMoviesService = async (meta, body): Promise<IResponse> => {
    try {
      const url = `${SWAPI_BASE_URL}/films/`;
      const response = await this.apiCall(url, null, DEFAULT_HEADERS, "GET");
      const { status } = response;
      if (status !== 200) return this.failureResponse("Unable to fetch movies");
      const responseJson = await response.json();
      const { results } = responseJson;
      const movies = await Promise.all(results.map(async (item) => {
        const {episode_id: episodeId, title, opening_crawl: openingCrawl, director, producer, release_date: releaseDate, created, edited, url} = item;
        const movieId = this.encryptString(url).toString();
        const commentCount = await MovieComment.count({where: {
          movieId: {
            [Op.like]: movieId
          },
          episodeId: {
            [Op.like]: episodeId
          }
        }});
        const movie = {
          episodeId, movieId, title, openingCrawl, director, producer, releaseDate, created, edited, commentCount
        };
        return movie;
      }))

      const sortedMovies = this.sortMoviesByReleaseDate(movies);
      
      return this.successResponse("Successful", sortedMovies);
    } catch (error) {
      return this.serviceErrorHandler(meta, error);
    }
  };

  public fetchMovieCharacters = async (req: Request): Promise<IResponse> => {
    const { ip, method, originalUrl, params, query } = req;
    const { movieId } = params;
    const sort = query.sort;
    const order = query.order || "asc";
    const filter = query.filter;
    try {

      const url = this.decryptString(movieId);
      const response = await this.apiCall(url, null, DEFAULT_HEADERS, "GET");
      const { status } = response;
      if (status !== 200) return this.failureResponse("Failed to fetch movie characters");
      const responseJson = await response.json();
      const { characters } = responseJson;

      let charactersObjArray : Array<ICharacter> = await Promise.all(characters.map(async (characterUrl): Promise<ICharacter> => {
        const response = await this.apiCall(characterUrl, null, DEFAULT_HEADERS, "GET");

        const responseJson = await response.json();
        const {name, height, mass, hair_color: hairColor, skin_color: skinColor, eye_color: eyeColor, birth_year: birthYear, gender, created, edited, url} = responseJson;
        const characterId = this.encryptString(url) as string;
        return {name, height, mass, hairColor, skinColor, eyeColor, birthYear, gender, created, edited, characterId};
      }));

      if (sort) {
        charactersObjArray.sort((a:ICharacter, b:ICharacter) => {
          switch (sort) {
            case "name" :
              if (order === "desc") return b.name.localeCompare(a.name); 
              return a.name.localeCompare(b.name);
            case "gender" :
              if (order === "desc") return b.gender.localeCompare(a.gender); 
              return a.gender.localeCompare(b.gender);
            case "height" :
              if (order === "desc") return Number(b.height) === Number(a.height) ? 0 : Number(b.height) < Number(a.height) ? -1 : 1; 
              return Number(b.height) === Number(a.height) ? 0 : Number(b.height) > Number(a.height) ? -1 : 1;
            default :
              return 0;
          }
          
        });
      }

      if (filter) {
        charactersObjArray = charactersObjArray.filter((character: ICharacter) => character.gender === filter);
      }

      const totalHeightInCM = charactersObjArray.reduce((sum, character: any) => {
        return Number(sum) + Number(character.height);
      }, 0);

      const totalHeightInFeetInches = this.convertToFeetInches(Number(totalHeightInCM));

      const metaData = {
        count: charactersObjArray.length,
        totalCharacterHeights: {
          centimeters: totalHeightInCM,
          feet: totalHeightInFeetInches
        }
      }
      
      return this.successResponse("Successful", {characters: charactersObjArray, metaData});
    } catch (error) {
      return this.serviceErrorHandler({ip, method, originalUrl}, error);
    }
  };

  public addMovieCommentService = async (meta, body): Promise<IResponse> => {
    const { movieId, episodeId, comment } = body;
    const username = body.username || "Anonymous";
    const { ip: userIPAddress } = meta;
    try {
      const movie = await MovieComment.create({
        movieId,
        episodeId,
        username,
        comment,
        userIPAddress
      })
      return this.successResponse("Successful", movie);
    } catch (error) {
      return this.serviceErrorHandler(meta, error);
    }
  };

  public fetchMovieCommentService = async (req: Request): Promise<IResponse> => {
    const { ip, originalUrl, method, params, query } = req;
    const { movieId } = params;
    let limit: any = query.limit;
    let page: any = query.page;
    limit = Number(limit) || 10;
    page = Number(page) || 1;
    const qry = {movieId};
    const options = {
      page,
      limit,
      sort: { createdAt: "desc" },
      collation: { locale: "en" },
    };
    try {
      const movieComments = await MovieComment.findAndCountAll({
        where: {movieId}, 
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: limit * (page - 1)
      });
      const totalComments = movieComments.count;
      const totalPages = Math.ceil(totalComments / limit);
      const data = {
        comments: movieComments.rows,
        meta: {
          totalComments,
          limit,
          totalPages,
          page,
          hasNextPage: totalPages > page,
          hasPrevPage: page > 1,
          nextPage: totalPages > page ? page+1 : null,
          prevPage: page > 1 ? page-1 : null
        }
      }
      return this.successResponse("Successful", data);
    } catch (error) {
      return this.serviceErrorHandler({ip, originalUrl, method}, error);
    }
  };

  private sortMoviesByReleaseDate = (moviesArray: Array<any>): Array<any> => {
    return moviesArray.sort((item1, item2) => {
      const item1Date : any = new Date(item1.releaseDate);
      const item2Date : any = new Date(item2.releaseDate);
      return item2Date - item1Date;
    })
  }

  private convertToFeetInches = (numInCM: number): string => {
    const numInFeet = numInCM * 0.0328084;
    let feet = numInFeet.toPrecision(6).split(".")[0];
    let feetDec = '0.' + numInFeet.toPrecision(6).split(".")[1];
    let inches = Number(feetDec) * 12;

    return `${feet}ft ${inches.toPrecision(5)}inches`;

  }
}
