import { Agenda } from "agenda";
import resetTagDay from "../services/resetTagDay.js";

const agenda = new Agenda({
  db: { address: process.env.AGENDA_KEY, collection: "agendaJobs" },
  processEvery: "30 seconds"
});

agenda.define("atualizar API", async () => {
  console.log("⚙️ Executando job: atualizar API");
  await resetTagDay();
});

agenda.on("start", job => console.log(`▶️ Iniciando job: ${job.attrs.name}`));
agenda.on("complete", job => console.log(`✅ Job concluído: ${job.attrs.name}`));
agenda.on("fail", (err, job) => console.error(`❌ Job falhou: ${job.attrs.name}`, err));

export async function jobResetTagDay() {
  await agenda.start();

  // Verifica se o job já existe no banco
  const jobs = await agenda.jobs({ name: 'atualizar API' });
  if (jobs.length === 0) {
    await agenda.every('00 12 * * 0', 'atualizar API');
  }
}
