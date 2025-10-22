import Tag from '../models/presenceModel.js';

export default async function resetTagDay() {
    try{
        const allTags = await Tag.find(
            {}
        )
        const resultado = await Tag.updateMany(
            {},
            {$set: {"presencaSchema.$[].alunos": []}}
        );
        return resultado;

    } catch (error) {
        console.error("Erro ao limpar lista de alunos:", error);
        throw error;
    }
}
