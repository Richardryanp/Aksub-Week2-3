const prisma = require("../config/prisma");

const findPublished = () => {
  return prisma.article.findMany({
    where: {
      published: true
    }
  });
};

const create = (data) => {
  return prisma.article.create({
    data
  });
};

const update = (id, data) => {
  return prisma.article.update({
    where: { id: Number(id) },
    data
  });
};

const remove = (id) => {
  return prisma.article.delete({
    where: { id: Number(id) }
  });
};

const publish = (id) => {
  return prisma.article.update({
    where: { id: Number(id) },
    data: { published: true }
  });
};

const searchByTitle = (title) => {
  return prisma.article.findMany({
    where: {
      title: {
        contains: title
      }
    }
  });
};

module.exports = {
  findPublished,
  create,
  update,
  remove,
  publish,
  searchByTitle
};