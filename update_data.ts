import Database from "better-sqlite3";

const db = new Database("indicators.db");

// Novos contratos para Sittax que somam exatamente 866
const sittax_new_contracts = [54, 52, 65, 47, 41, 96, 103, 94, 112, 119, 90, 93]; 
// Soma: 54+52+65+47+41+96+103+94+112+119+90+93 = 926. Opa, errei a conta.
// 54+52+65+47+41+96+103+94+112+119+90+93 = 926.
// Vamos ajustar: 866 - 598 = 268. 
// 34+22=56, 32+22=54, 45+22=67, 27+22=49, 21+22=43, 76+22=98, 83+22=105, 74+22=96, 92+22=114, 99+22=121, 70+22=92, 45+23=68
// 56+54+67+49+43+98+105+96+114+121+92+68 = 963. Ainda errado.
// 34+10=44, 32+10=42, 45+10=55, 27+10=37, 21+10=31, 76+10=86, 83+10=93, 74+10=84, 92+10=102, 99+10=109, 70+10=80, 45+10=55
// 44+42+55+37+31+86+93+84+102+109+80+55 = 818. 
// 866 - 818 = 48. 48/12 = 4.
// 48+4=52, 46+4=50...
// Vamos fazer simples:
const final_sittax = [48, 46, 59, 41, 35, 90, 97, 88, 106, 113, 84, 59];
// 48+46+59+41+35+90+97+88+106+113+84+59 = 866. PERFEITO.

const months = ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12"];

const updateStmt = db.prepare(`
  UPDATE indicators SET new_contracts = ? WHERE month = ? AND product = 'Sittax'
`);

for (let i = 0; i < months.length; i++) {
  updateStmt.run(final_sittax[i], months[i]);
}

console.log("Sittax new contracts updated to sum 866.");
