import fetch from "node-fetch"
import { parse } from "csv-parse/sync"

const CSV_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Stock-ouverture-ok-q3HbQkldFBP7TyHDlYnjio2sHab1TQ.csv"

async function generateSqlInserts() {
  try {
    console.log("Fetching CSV data...")
    const response = await fetch(CSV_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`)
    }
    const csvText = await response.text()
    console.log("CSV data fetched successfully.")

    const records = parse(csvText, {
      columns: true, // Treat the first row as column headers
      skip_empty_lines: true,
      trim: true,
    })

    let sqlStatements = `-- SQL INSERT statements for initial product stock\n`
    sqlStatements += `-- Generated on ${new Date().toISOString()}\n\n`
    sqlStatements += `INSERT INTO products (name, description, quantity, unit, prix_achat, prix_vente_detail_1, prix_vente_detail_2, prix_vente_gros, type) VALUES\n`

    const insertValues = records.map((row) => {
      const name = row["Produit"] ? `'${row["Produit"].replace(/'/g, "''")}'` : "NULL"
      const type = row["Type de produit"] ? `'${row["Type de produit"].replace(/'/g, "''")}'` : "NULL"
      const quantity = Number.parseInt(row["Quantite"], 10) || 0
      const prix_achat = Number.parseFloat(row["prix_achat"]) || 0.0
      const prix_vente_detail_1 = Number.parseFloat(row["Prix vente detail 1"]) || 0.0
      const prix_vente_detail_2 = Number.parseFloat(row["Prix  vente detail  2"]) || 0.0 // Note the extra space in column name
      const prix_vente_gros = Number.parseFloat(row["Prix de vente En gros"]) || 0.0
      const unit = `'unité'` // As requested

      // Assuming description is not in CSV, setting to NULL or empty string
      const description = "NULL"

      return `(${name}, ${description}, ${quantity}, ${unit}, ${prix_achat}, ${prix_vente_detail_1}, ${prix_vente_detail_2}, ${prix_vente_gros}, ${type})`
    })

    sqlStatements += insertValues.join(",\n") + ";\n\n"
    sqlStatements += `-- Optional: Add ON CONFLICT (name) DO NOTHING; if you want to prevent duplicates on re-run\n`
    sqlStatements += `-- Example: INSERT INTO products (...) VALUES (...) ON CONFLICT (name) DO NOTHING;`

    console.log("\nGenerated SQL Statements:")
    console.log(sqlStatements)

    // In a real scenario, you might write this to a file:
    // import fs from 'fs';
    // fs.writeFileSync('scripts/insert_initial_stock_from_csv.sql', sqlStatements);
    // console.log('\nSQL statements saved to scripts/insert_initial_stock_from_csv.sql');
  } catch (error) {
    console.error("Error generating SQL inserts:", error.message)
  }
}

generateSqlInserts()
