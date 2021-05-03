const user = require('../models/user');
const list = require('../models/list');
const task = require('../models/task');

async function addSection(req, res) {
  const { userId } = req.params;
  const { listId } = req.params;
  try {
    await list.findByIdAndUpdate(listId, {
      $push: { sections: { title: req.body.title } },
    });
    const updatedUser = await user.findById(userId);
    const populatedUser = await updatedUser
      .populate({
        path: 'lists',
        populate: {
          path: 'sections',
          populate: {
            path: 'tasks',
            populate: {
              path: 'lists',
              select: 'title color',
            },
          },
        },
      })
      .execPopulate();
    res.status(201);
    res.send(populatedUser.lists);
  } catch (error) {
    res.status(400);
    res.send({ error, message: 'Could not add section' });
  }
}

async function updateSection(req, res) {
  res.status(200).end();
}

async function deleteSection(req, res) {
  const { userId } = req.params;
  const { listId } = req.params;
  const { sectionId } = req.params;
  try {
    const currList = await list.findById(listId);
    const section = await currList.sections.id(sectionId);
    const deletedSection = await section.remove();
    await currList.save();
    // Get the tasks from the deleted section, and remove the list ID from each
    // of them.
    await deletedSection.tasks.forEach(async (taskId) => {
      await task.findByIdAndUpdate(taskId, { $pull: { lists: listId } });
    });
    const updatedUser = await user.findById(userId);
    const populatedUser = await updatedUser
      .populate({
        path: 'lists',
        populate: {
          path: 'sections',
          populate: {
            path: 'tasks',
            populate: {
              path: 'lists',
              select: 'title color',
            },
          },
        },
      })
      .execPopulate();
    res.status(200).send(populatedUser.lists);
  } catch (error) {
    res.status(500);
    res.send({
      error: JSON.stringify(error),
      message: 'Could not delete section',
    });
    console.error(error); // eslint-disable-line
  }
}

module.exports = {
  addSection,
  updateSection,
  deleteSection,
};
