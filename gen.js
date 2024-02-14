const { execSync } = require("child_process")
const fs = require("fs")
const filepath = require("path")

const workspace = "monokai"
const repo = "https://github.com/74th/vscode-monokaicharcoal"

function clone() {
  if (!fs.existsSync(workspace)) {
    console.log(`git clone ${repo} ${workspace}`)
    execSync(`git clone ${repo} ${workspace}`)
  }
}

function themeImporter(input, output) {
  execSync(`theme_importer ${input} ${output}`, {
    env: {
      PATH: "/Users/d1y/github/zed/target/debug", // TODO: add `theme_importer` env
    }
  })
}

function main() {
  clone()

  const result = {
    "$schema": "https://zed.dev/schema/themes/v0.1.0.json",
    "name": "Monokai Charcoal",
    "author": "d1y",
    "themes": [],
  }

  const themesDir = filepath.join(workspace, "themes")
  const files = fs.readdirSync(themesDir).filter(item=> item.endsWith(".json"))
  files.forEach(file=> {

    const rawJSONFile = filepath.join(themesDir, file)
    const output = filepath.join("themes", file)
    themeImporter(rawJSONFile, output)
    let content = fs.readFileSync(output).toString('utf-8')
    content = JSON.parse(content)

    result.themes.push(content)

    // need remove file
    fs.rmSync(output)

  })

  // skip the output with each
  const output = filepath.join("themes", "monokai-charcoal.json")
  fs.writeFileSync(output, JSON.stringify(result, null, 2), 'utf-8')

}

main()
