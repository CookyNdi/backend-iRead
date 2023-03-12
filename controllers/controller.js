const { comparePassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const { User, Content, readingList } = require("../models");
const path = require("path");
const fs = require("fs");
const Sequelize = require("sequelize");
// import Op from "sequelize";
// import path from "path"

class SuperController {
  static async welcome(req, res, next) {
    res.status(200).json({
      message: "Hello Welcome to FE Kawah Edukasi BE Server",
    });
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      if (username && password) {
        const user = await User.findOne({ where: { username: username } });
        if (user) {
          const isValidPass = comparePassword(password, user.password);
          if (isValidPass) {
            const payload = {
              username: user.username,
            };
            res.status(200).json({
              access_token: createToken(payload),
            });
          } else {
            throw {
              name: "Invalid Username or Password",
            };
          }
        } else {
          throw {
            name: "Invalid Username or Password",
          };
        }
      } else {
        throw {
          name: "Invalid Username or Password",
        };
      }
    } catch (error) {
      next(error);
    }
  }

  static async getAllContent(req, res, next) {
    try {
      const contents = await Content.findAll();
      console.log(contents);
      if (contents) {
        res.status(200).json(contents);
      } else {
        throw {
          name: "Content Not Found",
        };
      }
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  static async incPageView(req, res, next) {
    const bookId = req.body.id;
    // const increment = req.body.increment;
    try {
      await Content.increment(
        {
          PageViews: 1,
        },
        {
          where: {
            id: bookId,
          },
        }
      );
      res.status(200).json({
        message: `Page View On Book Id ${bookId} Increment`,
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async searchContent(req, res, next) {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.query || "";
    const offset = limit * page;
    const totalData = await Content.count({
      where: {
        [Sequelize.Op.or]: [
          {
            Title: {
              [Sequelize.Op.iLike]: "%" + search + "%",
            },
          },
          {
            Genres: {
              [Sequelize.Op.iLike]: "%" + search + "%",
            },
          },
        ],
      },
    });
    const totalPage = Math.ceil(totalData / limit);
    const result = await Content.findAll({
      where: {
        [Sequelize.Op.or]: [
          {
            Title: {
              [Sequelize.Op.iLike]: "%" + search + "%",
            },
          },
          {
            Genres: {
              [Sequelize.Op.iLike]: "%" + search + "%",
            },
          },
        ],
      },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
    res.json({
      result: result,
      page: page,
      limit: limit,
      totalData: totalData,
      totalPage: totalPage,
    });
  }

  static async getContentById(req, res, next) {
    try {
      const id = req.params.id;
      const contents = await Content.findOne({
        where: {
          id,
        },
      });
      console.log(contents);
      if (contents) {
        res.status(200).json(contents);
      } else {
        throw {
          name: "Content Not Found",
        };
      }
    } catch (error) {
      next(error);
    }
  }

  static async createContent(req, res, next) {
    if (req.file === null) return res.status(400).json({ msg: "No File Uploaded" });
    const UserId = req.user.id;
    const Username = req.user.username;
    const Title = req.body.title;
    const Sinopsis = req.body.sinopsis;
    const Stories = req.body.stories;
    const Genres = req.body.genres;
    const ReleaseDate = req.body.releaseDate;
    const PageViews = 0;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const Url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg", ".webp"];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5mb" });

    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        await Content.create({
          UserId: UserId,
          Username: Username,
          Title: Title,
          Poster: fileName,
          Url: Url,
          Sinopsis: Sinopsis,
          Stories: Stories,
          Genres: Genres,
          ReleaseDate: ReleaseDate,
          PageViews: PageViews,
        });
        res.status(201).json({
          message: "Success Create",
        });
      } catch (error) {
        next(error);
        console.log(error);
      }
    });
  }

  static async updateContent(req, res, next) {
    const contentId = req.params.id;
    const result = await Content.findByPk(contentId);
    let fileName = "";

    if (req.files === null) {
      fileName = Content.Poster;
    } else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
      if (!allowedType.includes(ext.toLowerCase()))
        return res
          .status(422)
          .json({ msg: "Invalid Images, Please Add Image With extension (png, jpg, jpeg, gif, webp)" });
      if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5mb" });
      const filePath = `./public/images/${result.Poster}`;
      fs.unlinkSync(filePath);
      file.mv(`./public/images/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }

    const Title = req.body.title;
    const Url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const Sinopsis = req.body.sinopsis;
    const Stories = req.body.stories;
    const Genres = req.body.genres;
    const ReleaseDate = req.body.releaseDate;
    try {
      await Content.update(
        {
          Title: Title,
          Poster: fileName,
          Url: Url,
          Sinopsis: Sinopsis,
          Stories: Stories,
          Genres: Genres,
          ReleaseDate: ReleaseDate,
        },
        {
          where: {
            id: contentId,
          },
        }
      );
      res.status(200).json({
        message: "Content Update Successfuly",
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  static async deleteContent(req, res, next) {
    try {
      const contentId = req.params.id;
      const result = await Content.findOne(contentId);
      if (result) {
        const filePath = `./public/images/${result.Poster}`;
        fs.unlinkSync(filePath);
        await Content.destroy({
          where: {
            id: contentId,
          },
        });
        res.status(200).json({
          message: "Success Delete",
        });
      } else {
        res.status(404).json({
          name: "Content Not Found",
        });
      }
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  static async getReadingList(req, res, next) {
    try {
      const UserId = req.user.id;
      const contents = await readingList.findAll({
        where: {
          UserId,
        },
      });
      console.log(contents);
      if (contents) {
        res.status(200).json(contents);
      } else {
        throw {
          name: "Content Not Found",
        };
      }
    } catch (error) {
      next(error);
    }
  }

  static async addToReadingList(req, res, next) {
    try {
      const UserId = req.user.id;
      const BookId = parseInt(req.body.id);
      const AuthorBook = req.body.username;
      const Title = req.body.title;
      const Sinopsis = req.body.sinopsis;
      const Poster = req.body.poster;
      const Url = req.body.url;
      const Stories = req.body.stories;
      const Genres = req.body.genres;
      const ReleaseDate = req.body.releaseDate;

      const result = await readingList.findOne({
        where: {
          UserId,
          BookId,
        },
      });
      if (!result) {
        await readingList.create({
          UserId: UserId,
          BookId: BookId,
          AuthorBook: AuthorBook,
          Title: Title,
          Poster: Poster,
          Url: Url,
          Sinopsis: Sinopsis,
          Stories: Stories,
          Genres: Genres,
          ReleaseDate: ReleaseDate,
        });
        res.status(201).json({
          message: "Success Add To Reading List",
        });
      } else {
        throw {
          message: "Content Already Added",
        };
      }
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  static async removeFromReadingList(req, res, next) {
    try {
      const UserId = req.user.id;
      const BookId = req.body.bookid;
      const result = await readingList.findOne({
        where: {
          UserId,
          BookId,
        },
      });
      if (result) {
        await readingList.destroy({
          where: {
            UserId,
            BookId,
          },
        });
        res.status(200).json({
          message: "Success Delete",
        });
      } else {
        throw {
          name: "Content Not Found",
        };
      }
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
}

module.exports = SuperController;
