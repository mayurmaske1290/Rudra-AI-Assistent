const Publisher = require('../models/Publisher');

exports.createPublisher = async (req, res) => res.status(201).json(await Publisher.create(req.body));
exports.getPublishers = async (req, res) => res.json(await Publisher.find().sort({ createdAt: -1 }));
exports.updatePublisher = async (req, res) => {
  const data = await Publisher.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!data) return res.status(404).json({ message: 'Publisher not found' });
  return res.json(data);
};
exports.deletePublisher = async (req, res) => {
  const data = await Publisher.findByIdAndDelete(req.params.id);
  if (!data) return res.status(404).json({ message: 'Publisher not found' });
  return res.json({ message: 'Publisher deleted' });
};
