import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ModelAttributes, DataTypes } from "sequelize";
import { sequelize } from "../../@core/database/database.sql";

// export const MovieCommentsSchema = new Schema(
//   {
//     movieId: String,
//     episodeId: String,
//     comment: String,
//     userIPAddress: String,
//     username: String
//   },
//   { timestamps: true }
// );

// MovieCommentsSchema.plugin(mongoosePaginate);

// const MovieComment = model("movie-comments", MovieCommentsSchema);

// export default MovieComment;

export const MovieCommentsSchema: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  movieId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  episodeId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  comment: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  userIPAddress: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING
  },
  // createdAt: {
  //   type: DataTypes.DATE,
  //   defaultValue: new Date().toISOString(),
  //   allowNull: false,
  // },
  // updatedAt: {
  //   type: DataTypes.DATE,
  //   defaultValue: new Date().toISOString(),
  //   allowNull: false,
  // },
};

const MovieComment = sequelize.define("movie-comments", MovieCommentsSchema);

export default MovieComment;
