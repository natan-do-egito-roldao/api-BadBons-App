import Unit from '../../models/unitModel.js';

export const timeTableController = async (req, res) => {
  try {
    const units = req.query.units;
    let count = 0;
    const newTagDay1 = await Unit.find({ bairro: units[count] });
    console.log(newTagDay1);
    res.status(200).json({ success: true, data: newTagDay1 });
  } catch (error) {
    console.error("Erro ao buscar unidades:", error);
    res.status(500).json({ success: false, message: "Erro ao buscar unidades" });
  }
};
