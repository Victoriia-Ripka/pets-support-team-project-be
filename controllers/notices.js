const { httpError, createAvatar } = require("../helpers");
const { User, Notices, Pets } = require("../models");
const { ctrlWrapper } = require("../helpers");

const selectCategory = {
  category: 1,
  title: 1,
  breed: 1,
  place: 1,
  dateofbirth: 1,
  price: 1,
  avatarURL: 1,
  owner: 1,
};

const getNoticesByCategories = async (req, res) => {
  const { keyword } = req.query;
  const { category } = req.params;
  let { page } = req.query;

  page = parseInt(page);
  let skip = 0;
  let limit = 16;
  if (page && page >= 1) {
    skip = (page - 1) * limit;
  } else {
    page = 1;
  }

  let query = {};
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { breed: { $regex: keyword, $options: "i" } },
      { comments: { $regex: keyword, $options: "i" } },
    ];
  }

  if (
    category !== "sell" &&
    category !== "lost-found" &&
    category !== "in-good-hands"
  ) {
    throw httpError(400, "bad request");
  }

  query.$and = [{ category: category }];

  Notices.find({ category, ...query })
    .select(selectCategory)
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 })
    .exec((err, doc) => {
      if (err) {
        return res.json(err);
      }
      Notices.countDocuments({ category, ...query }).exec(
        (count_error, count) => {
          if (err) {
            return res.json(count_error);
          }
          const totalPages = Math.ceil(count / limit);
          return res.status(200).json({
            total_results: count,
            total_pages: totalPages,
            page: page,
            notices: doc,
          });
        }
      );
    });
};

const getNoticeById = async (req, res) => {
  const { noticeId } = req.params;
  const pet = await Notices.findById(noticeId).lean();

  if (!pet) {
    throw httpError(404, "bad request");
  }

  const owner = await User.findById(pet.owner);
  pet.email = owner.email;
  pet.phone = owner.phone;
  pet.ownername = owner.name;

  res.status(200).json(pet);
};

const addToFavorite = async (req, res) => {
  const { noticeId } = req.params;
  const { id } = req.user;

  if (!id) {
    throw httpError(401);
  }

  const doesNoticeExists = await Notices.findById({ _id: noticeId });

  if (!doesNoticeExists) {
    throw httpError(404, "notice doesn't exist");
  }

  try {
    await User.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { favorites: noticeId } },
      { fields: { favorites: 1 } }
    );
    res.status(200).json(doesNoticeExists);
  } catch (error) {
    throw httpError(404, "bad request");
  }
};

const removeFromFavorite = async (req, res) => {
  const { noticeId } = req.params;
  const { id } = req.user;

  if (!id) {
    throw httpError(401);
  }

  try {
    await User.findByIdAndUpdate(
      { _id: id },
      { $pull: { favorites: noticeId } },
      { fields: { favorites: 1 } }
    );
    res.status(200).json({ id: noticeId });
  } catch (error) {
    res.status(404).json({ message: "bad request" });
  }
};

const getFavoriteNotices = async (req, res) => {
  const { keyword } = req.query;
  const { id } = req.user;
  let { page } = req.query;

  page = parseInt(page);
  let skip = 0;
  let limit = 16;
  if (page && page >= 1) {
    skip = (page - 1) * limit;
  } else {
    page = 1;
  }

  let query = {};
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { breed: { $regex: keyword, $options: "i" } },
      { comments: { $regex: keyword, $options: "i" } },
    ];
  }

  const [pets] = await User.find({ _id: id }, { favorites: 1 }).populate({
    path: "favorites",
    options: { sort: { created_at: -1 } },
    select: "_id",
  });

  query.$and = [{ _id: pets["favorites"] }];

  Notices.find({ ...query })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 })
    .exec((err, doc) => {
      if (err) {
        return res.json(err);
      }
      Notices.countDocuments({ ...query }).exec((count_error, count) => {
        if (err) {
          return res.json(count_error);
        }
        const totalPages = Math.ceil(count / limit);
        return res.status(200).json({
          total_results: count,
          total_pages: totalPages,
          page: page,
          notices: doc,
        });
      });
    });
};

const addNotice = async (req, res) => {
  const {
    title,
    name,
    dateofbirth,
    breed,
    place,
    price,
    sex,
    comments,
    category,
  } = req.body;
  if ((category === "sell") & !price) {
    res.status(400).json({ message: "Price is required" });
  }
  let parseIntPrice = undefined;
  price ? (parseIntPrice = parseInt(price, 10)) : null;
  const { id } = req.user;
  const width = 280;
  const height = 280;
  let avatarURL = undefined;
  if (req?.file?.path) {
    avatarURL = await createAvatar(req.file.path, width, height);
  }
  const pet = new Notices({
    owner: id,
    title,
    name,
    dateofbirth,
    breed,
    place,
    price: parseIntPrice,
    sex,
    comments,
    category,
    avatarURL,
  });
  await pet.save();
  res.status(201).json(pet);
};

const getUserNotices = async (req, res) => {
  const { id } = req.user;
  const { keyword } = req.query;
  let { page } = req.query;

  page = parseInt(page);
  let skip = 0;
  let limit = 16;
  if (page && page >= 1) {
    skip = (page - 1) * limit;
  } else {
    page = 1;
  }

  let query = {};
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { breed: { $regex: keyword, $options: "i" } },
      { comments: { $regex: keyword, $options: "i" } },
    ];
  }

  query.$and = [{ owner: id }];

  Notices.find({ ...query })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 })
    .exec((err, doc) => {
      if (err) {
        return res.json(err);
      }
      Notices.countDocuments({ ...query }).exec((count_error, count) => {
        if (err) {
          return res.json(count_error);
        }
        const totalPages = Math.ceil(count / limit);
        return res.json({
          total_results: count,
          total_pages: totalPages,
          page: page,
          notices: doc,
        });
      });
    });
};

const getOwnerNotices = async (req, res) => {
  const { id } = req.params;
  const { keyword } = req.query;
  let { page } = req.query;

  page = parseInt(page);
  let skip = 0;
  let limit = 16;
  if (page && page >= 1) {
    skip = (page - 1) * limit;
  } else {
    page = 1;
  }

  let query = {};
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { breed: { $regex: keyword, $options: "i" } },
      { comments: { $regex: keyword, $options: "i" } },
    ];
  }

  query.$and = [{ owner: id }];

  Notices.find({ ...query })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 })
    .exec((err, doc) => {
      if (err) {
        return res.json(err);
      }
      Notices.countDocuments({ ...query }).exec((count_error, count) => {
        if (err) {
          return res.json(count_error);
        }
        const totalPages = Math.ceil(count / limit);
        return res.json({
          total_results: count,
          total_pages: totalPages,
          page: page,
          notices: doc,
        });
      });
    });
};

const deleteNotice = async (req, res) => {
  const { noticeId } = req.params;
  const pet = await Notices.findByIdAndDelete(noticeId);
  if (!pet) {
    res.status(404).json({ message: "bad request" });
  }
  res.status(200).json({ message: "success" });
};

module.exports = {
  getNoticesByCategories: ctrlWrapper(getNoticesByCategories),
  getNoticeById: ctrlWrapper(getNoticeById),
  addToFavorite: ctrlWrapper(addToFavorite),
  removeFromFavorite: ctrlWrapper(removeFromFavorite),
  getFavoriteNotices: ctrlWrapper(getFavoriteNotices),
  addNotice: ctrlWrapper(addNotice),
  getUserNotices: ctrlWrapper(getUserNotices),
  getOwnerNotices: ctrlWrapper(getOwnerNotices),
  deleteNotice: ctrlWrapper(deleteNotice),
};
