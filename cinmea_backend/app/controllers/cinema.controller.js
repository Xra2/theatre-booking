const db = require("../models");
const Cinema = db.cinema;

exports.getCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.findAll();
    res.status(200).send(cinemas);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving cinemas", error });
  }
};

exports.handleDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const cinema = await Cinema.destroy({ where: { id } });
    if (cinema) {
      res.status(200).send({ message: `Cinema with ID ${id} deleted successfully.` });
    } else {
      res.status(404).send({ message: `Cinema with ID ${id} not found.` });
    }
  } catch (error) {
    res.status(500).send({ message: "Error deleting cinema", error });
  }
};

exports.handleCreate = async (req, res) => {
  const { name, time, location } = req.body;
  try {
    const newCinema = await Cinema.create({ name, time, location });
    res.status(201).send({
      message: "Cinema created successfully.",
      cinema: {
        id: newCinema.id,
        name: newCinema.name,
        time: newCinema.time,
        location: newCinema.location,
        createdAt: newCinema.createdAt,
        updatedAt: newCinema.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Error creating cinema", error });
  }
};

exports.handleUpdate = async (req, res) => {
  const { id } = req.params;
  const fieldsToUpdate = req.body;

  try {
    const [updateCount, updatedCinemas] = await Cinema.update(fieldsToUpdate, {
      where: { id },
      returning: true,
    });

    if (updateCount > 0) {
      const updatedCinema = updatedCinemas[0];
      res.status(200).send({
        message: `Cinema with ID ${id} updated successfully.`,
        cinema: {
          id: updatedCinema.id,
          name: updatedCinema.name,
          time: updatedCinema.time,
          location: updatedCinema.location,
          createdAt: updatedCinema.createdAt,
          updatedAt: updatedCinema.updatedAt,
        },
      });
    } else {
      res.status(404).send({ message: `Cinema with ID ${id} not found.` });
    }
  } catch (error) {
    res.status(500).send({ message: "Error updating cinema", error });
  }
};
