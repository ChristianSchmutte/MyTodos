const user = require('../models/user');
const list = require('../models/list');

async function populatedUserListResponse(responseUser, res, status) {
  const populatedUser = await responseUser
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
  res.status(status);
  res.send(populatedUser.lists);
}

async function getLists(req, res) {
  const { userId } = req.params;
  try {
    // TODO: should throw error if user does not exist, and not hang
    const currUser = await user.findById(userId);
    await populatedUserListResponse(currUser, res, 200);
  } catch (error) {
    res.status(500);
    res.send({ error, message: 'Did not find lists for user' });
    console.error(error); // eslint-disable-line
  }
}

async function addList(req, res) {
  if (req.body.title === undefined) {
    res.status(400);
    res.send({ message: 'Invalid body' });
  } else {
    const { userId } = req.params;
    try {
      // Create new list, with default section
      const newList = await list.create({
        title: req.body.title,
        sections: [{ isDefaultSection: true }],
        userId,
      });
      const { lists } = await user.findById(userId);
      const updatedUser = await user.findByIdAndUpdate(
        userId,
        {
          lists: [newList._id, ...lists],
        },
        { new: true } // eslint-disable-line
      );
      await populatedUserListResponse(updatedUser, res, 201);
    } catch (error) {
      res.status(400);
      res.send({ error, message: 'Could not add list' });
      console.error(error); // eslint-disable-line
    }
  }
}

async function updateListsOrder(req, res) {
  try {
    const { userId } = req.params;
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      {
        lists: [...req.body.lists],
      },
      { new: true } // eslint-disable-line
    );
    res.status(200);
    res.send(updatedUser.lists);
  } catch (error) {
    res.status(500);
    res.send({ error, message: 'Could not update lists order' });
    console.error(error); // eslint-disable-line
  }
}

async function updateTasksOrder(req, res) {
  try {
    const { listId } = req.params;
    const currList = await list.findById(listId);
    // Update order of tasks in each section
    req.body.sections.forEach(async (section) => {
      const currSection = await currList.sections.id(section._id);
      currSection.tasks = [...section.tasks];
    });
    // TODO Update order of sections
    // This did NOT work:
    // const sectionIdsNewOrder = _.map(req.body.sections, '_id');
    // console.log('sectionIdsNewOrder', sectionIdsNewOrder);
    // console.log('Result of sortBy', _.sortBy(currList.sections, (section) => (
    //   sectionIdsNewOrder.indexOf(section._id)
    // )));
    // currList.sections = _.sortBy(currList.sections, (section) => (
    //   sectionIdsNewOrder.indexOf(section._id)
    // ));
    const updatedList = await currList.save();
    res.status(200);
    res.send(updatedList);
  } catch (error) {
    res.status(500);
    res.send({ error, message: 'Could not update tasks order' });
    console.error(error); // eslint-disable-line
  }
}

async function deleteList(req, res) {
  const { listId } = req.params;
  const { userId } = req.params;
  try {
    await list.findByIdAndDelete(listId);
    // TODO: Get the tasks from the list remove references to the listId
    // from their list property, so that keep the database cleaner
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      { $pull: { lists: listId } },
      { new: true } // eslint-disable-line
    );
    await populatedUserListResponse(updatedUser, res, 200);
  } catch (error) {
    res.status(400);
    res.send({ error, message: 'Could not delete list' });
  }
}

module.exports = {
  getLists,
  addList,
  deleteList,
  updateListsOrder,
  updateTasksOrder,
};
