#!/usr/bin/env node
import fs from "fs";
import path from "path";
import readline from "readline";
import { execSync } from "child_process";

const cwd = process.cwd();

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
}
function exists(p) {
  return fs.existsSync(p);
}
function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd });
}

function getArg(name) {
  const idx = process.argv.indexOf(name);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
}

async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const ans = await new Promise((res) => rl.question(question, res));
  rl.close();
  return String(ans).trim();
}

function ensureSlash(url) {
  return url.endsWith("/") ? url : url + "/";
}

function writeCapConfigs({ appId, appName }) {
  const prod = `import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
      style: 'DEFAULT',     
    },
  },
  appId: '${appId}',
  appName: '${appName}',
  webDir: 'dist',
};

export default config;
`;

  const dev = `import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
      style: 'DEFAULT',     
    },
  },
  appId: '${appId}',
  appName: '${appName}',
  webDir: 'dist',
  server: {
    url: 'http://10.0.2.2:5173',
    cleartext: true,
  },
};

export default config;
`;

  fs.writeFileSync(path.join(cwd, "capacitor.config.prod.ts"), prod, "utf8");
  fs.writeFileSync(path.join(cwd, "capacitor.config.dev.ts"), dev, "utf8");

  // Por padrão, deixa DEV ativo (pra primeira execução ser suave)
  fs.copyFileSync(
    path.join(cwd, "capacitor.config.dev.ts"),
    path.join(cwd, "capacitor.config.ts"),
  );
}

function upsertScripts(pkg) {
  pkg.scripts ??= {};

  // Vite
  pkg.scripts["dev"] = pkg.scripts["dev"] || "vite";
  pkg.scripts["dev:mobile"] = "vite --host 0.0.0.0 --port 5173";

  // Capacitor: escolhe config via copy (Windows-friendly e não depende de env/flags)
  pkg.scripts["cap:use:dev"] =
    "copy /Y capacitor.config.dev.ts capacitor.config.ts";
  pkg.scripts["cap:use:prod"] =
    "copy /Y capacitor.config.prod.ts capacitor.config.ts";

  pkg.scripts["cap:add:android"] = "cap add android";

  pkg.scripts["cap:sync"] = "npm run cap:use:prod && cap sync";
  pkg.scripts["cap:sync:dev"] = "npm run cap:use:dev && cap sync";

  pkg.scripts["cap:run:android"] = "npm run cap:use:prod && cap run android";
  pkg.scripts["cap:run:android:dev"] = "npm run cap:use:dev && cap run android";

  // Atalho top: um comando pra rodar mobile dev (assume 2 terminais)
  pkg.scripts["mobile:dev"] = "npm run dev:mobile";
}

function ensureEnv(apiUrl) {
  const envPath = path.join(cwd, ".env");
  if (!exists(envPath)) {
    fs.writeFileSync(envPath, `VITE_API_URL=${ensureSlash(apiUrl)}\n`, "utf8");
  }
  const envExample = path.join(cwd, ".env.example");
  if (!exists(envExample)) {
    fs.writeFileSync(
      envExample,
      `VITE_API_URL=${ensureSlash(apiUrl)}\n`,
      "utf8",
    );
  }
}

function ensureDeps(pkg) {
  pkg.dependencies ??= {};
  // Se você usa devDependencies no template, pode trocar pra devDependencies.
  const deps = pkg.dependencies;

  // Pin opcional: você pode travar versões aqui se quiser consistência total.
  if (!deps["@capacitor/core"]) deps["@capacitor/core"] = "^8.0.0";
  if (!deps["@capacitor/cli"]) deps["@capacitor/cli"] = "^8.0.0";
  if (!deps["@capacitor/android"]) deps["@capacitor/android"] = "^8.0.0";
  if (!deps["@capacitor/push-notifications"])
    deps["@capacitor/push-notifications"] = "^8.0.1";
}

function ensureCapacitorPushDeps(pkg) {
  pkg.dependencies ??= {};
  const deps = pkg.dependencies;

  if (!deps["@capacitor/push-notifications"])
    deps["@capacitor/push-notifications"] = "^8.0.1";
  // Se você usa firebase web SDK no app web, pode colocar aqui também, mas não é obrigatório pro push nativo.
  // if (!deps["firebase"]) deps["firebase"] = "^10.0.0";
}

function readFileIfExists(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
}

function writeFileIfChanged(p, content) {
  const cur = readFileIfExists(p);
  if (cur === content) return false;
  fs.writeFileSync(p, content, "utf8");
  return true;
}

function ensureAndroidGoogleServices({
  googleServicesJsonPath,
  googleServicesJsonBase64,
}) {
  const target = path.join(cwd, "android", "app", "google-services.json");
  let jsonContent = null;

  if (googleServicesJsonPath) {
    const abs = path.isAbsolute(googleServicesJsonPath)
      ? googleServicesJsonPath
      : path.join(cwd, googleServicesJsonPath);

    if (!fs.existsSync(abs)) {
      throw new Error(`google-services.json não encontrado em: ${abs}`);
    }
    jsonContent = fs.readFileSync(abs, "utf8");
  } else if (googleServicesJsonBase64) {
    jsonContent = Buffer.from(
      String(googleServicesJsonBase64),
      "base64",
    ).toString("utf8");
  }

  if (!jsonContent) {
    console.warn(
      "\n[warn] Firebase não configurado: google-services.json não foi fornecido.\n" +
        "       Para habilitar Push (FCM) no Android, passe:\n" +
        "       --googleServicesJson <caminho>  OU  --googleServicesJsonBase64 <base64>\n",
    );
    return;
  }

  // Validação mínima (não é validação completa)
  if (
    !jsonContent.includes('"project_info"') ||
    !jsonContent.includes('"client"')
  ) {
    throw new Error(
      "Conteúdo fornecido não parece um google-services.json válido.",
    );
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, jsonContent, "utf8");
  console.log(`[ok] google-services.json escrito em: ${target}`);
}

function patchGradleForGoogleServices() {
  // 1) android/build.gradle (classpath)
  const gradleProject = path.join(cwd, "android", "build.gradle");
  let projectGradle = readFileIfExists(gradleProject);
  if (!projectGradle) {
    console.warn(
      "[warn] android/build.gradle não encontrado. Vou pular patch de classpath.",
    );
  } else {
    // garante classpath do google-services
    if (!projectGradle.includes("com.google.gms:google-services")) {
      // tenta inserir dentro de dependencies do buildscript
      const marker = "dependencies {";
      const idx = projectGradle.indexOf(marker);
      if (idx !== -1) {
        const insertAt = idx + marker.length;
        projectGradle =
          projectGradle.slice(0, insertAt) +
          "\n        classpath 'com.google.gms:google-services:4.4.2'" +
          projectGradle.slice(insertAt);
        writeFileIfChanged(gradleProject, projectGradle);
        console.log(
          "[ok] Patch aplicado em android/build.gradle (classpath google-services).",
        );
      } else {
        console.warn(
          "[warn] Não encontrei 'dependencies {' em android/build.gradle. Patch manual pode ser necessário.",
        );
      }
    } else {
      console.log(
        "[ok] android/build.gradle já possui classpath do google-services.",
      );
    }
  }

  // 2) android/app/build.gradle (apply plugin)
  const gradleApp = path.join(cwd, "android", "app", "build.gradle");
  let appGradle = readFileIfExists(gradleApp);
  if (!appGradle) {
    console.warn(
      "[warn] android/app/build.gradle não encontrado. Vou pular patch do plugin.",
    );
    return;
  }

  // Capacitor 8 costuma usar plugins { } ao invés de apply plugin
  const hasPluginsBlock = /^\s*plugins\s*{/m.test(appGradle);

  if (hasPluginsBlock) {
    if (
      !appGradle.includes("id 'com.google.gms.google-services'") &&
      !appGradle.includes('id "com.google.gms.google-services"')
    ) {
      // insere dentro do plugins { ... }
      appGradle = appGradle.replace(
        /^\s*plugins\s*{\s*/m,
        (m) => `${m}\n    id 'com.google.gms.google-services'`,
      );
      writeFileIfChanged(gradleApp, appGradle);
      console.log(
        "[ok] Patch aplicado em android/app/build.gradle (plugins id google-services).",
      );
    } else {
      console.log(
        "[ok] android/app/build.gradle já possui plugin google-services.",
      );
    }
  } else {
    // fallback estilo antigo
    if (!appGradle.includes("apply plugin: 'com.google.gms.google-services'")) {
      appGradle += "\n\napply plugin: 'com.google.gms.google-services'\n";
      writeFileIfChanged(gradleApp, appGradle);
      console.log(
        "[ok] Patch aplicado em android/app/build.gradle (apply plugin google-services).",
      );
    } else {
      console.log(
        "[ok] android/app/build.gradle já possui apply plugin google-services.",
      );
    }
  }
}

function patchAndroidManifest({ channelId = "alerts" }) {
  const manifestPath = path.join(
    cwd,
    "android",
    "app",
    "src",
    "main",
    "AndroidManifest.xml",
  );
  if (!fs.existsSync(manifestPath)) {
    console.warn(
      `[warn] AndroidManifest não encontrado em ${manifestPath} (android ainda não foi gerado?)`,
    );
    return;
  }

  let xml = fs.readFileSync(manifestPath, "utf8");

  const metaChannel = `
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_channel_id"
            android:value="${channelId}" />`;

  // opcional (ícone padrão)
  const metaIcon = `
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_icon"
            android:resource="@mipmap/ic_launcher" />`;

  // 1) garante que existe <application ...>
  const appOpenIdx = xml.search(/<application\b[^>]*>/);
  if (appOpenIdx === -1) {
    console.warn(
      "[warn] Não encontrei <application ...> no AndroidManifest.xml. Patch manual pode ser necessário.",
    );
    return;
  }

  // 2) se já tem o meta-data do channel, só atualiza o value
  if (
    xml.includes(
      'android:name="com.google.firebase.messaging.default_notification_channel_id"',
    )
  ) {
    xml = xml.replace(
      /android:name="com\.google\.firebase\.messaging\.default_notification_channel_id"[\s\S]*?android:value="[^"]*"/,
      `android:name="com.google.firebase.messaging.default_notification_channel_id"\n            android:value="${channelId}"`,
    );
  } else {
    // injeta logo depois da abertura de <application ...>
    xml = xml.replace(/(<application\b[^>]*>)/, `$1${metaChannel}`);
  }

  // 3) idem pro ícone (opcional)
  if (
    !xml.includes(
      'android:name="com.google.firebase.messaging.default_notification_icon"',
    )
  ) {
    xml = xml.replace(/(<application\b[^>]*>)/, `$1${metaIcon}`);
  }

  fs.writeFileSync(manifestPath, xml, "utf8");
  console.log(
    `[ok] AndroidManifest patch aplicado (FCM default channel: ${channelId})`,
  );
}

async function main() {
  const pkgPath = path.join(cwd, "package.json");
  if (!exists(pkgPath)) {
    console.error(
      "Não achei package.json na raiz. Rode o script na raiz do projeto.",
    );
    process.exit(1);
  }

  const pkg = readJson(pkgPath);

  const defaultName = pkg.name ? String(pkg.name) : "MeuApp";
  const appName =
    getArg("--appName") ||
    (await prompt(`App name (${defaultName}): `)) ||
    defaultName;

  const defaultId = "com.seunome.app";
  const appId =
    getArg("--appId") ||
    (await prompt(`App id (ex: com.suaempresa.app) (${defaultId}): `)) ||
    defaultId;

  const defaultApi = "http://localhost:8000/";
  const apiUrl =
    getArg("--apiUrl") ||
    (await prompt(`VITE_API_URL (${defaultApi}): `)) ||
    defaultApi;

  console.log("\nCriando configs do Capacitor...");
  writeCapConfigs({ appId, appName });

  console.log("Atualizando scripts/deps do package.json...");
  upsertScripts(pkg);
  ensureDeps(pkg);
  writeJson(pkgPath, pkg);

  console.log("Criando .env/.env.example (se não existirem)...");
  ensureEnv(apiUrl);

  // Instala deps
  run("npm install");

  // Inicializa Capacitor se necessário (cap init cria capacitor.config.* mas nós já criamos)
  // Então aqui só garantimos que a CLI está disponível e adicionamos Android:
  if (!exists(path.join(cwd, "android"))) {
    run("npx cap add android");
  }

  patchAndroidManifest({ channelId: "alerts" });

  // Firebase/FCM (Android)
  const googleServicesJsonPath = getArg("--googleServicesJson");
  const googleServicesJsonBase64 = getArg("--googleServicesJsonBase64");

  // patch gradle para google-services
  patchGradleForGoogleServices();

  // copia/escreve google-services.json
  ensureAndroidGoogleServices({
    googleServicesJsonPath,
    googleServicesJsonBase64,
  });

  fs.mkdirSync(path.join(cwd, "android", "app", "src", "main", "assets"), {
    recursive: true,
  });

  writeAndroidLocalProperties();

  // Sync e pronto
  run("npx cap sync");

  console.log("\n✅ Mobile init concluído!");
  console.log("\nPróximos passos (2 terminais):");
  console.log("1) npm run dev:mobile");
  console.log("2) npm run cap:run:android:dev");
  console.log("\nBackend (Django) no emulador:");
  console.log("- python manage.py runserver 0.0.0.0:8000");
  console.log(
    "- App usa 10.0.2.2 automaticamente quando VITE_API_URL é localhost\n",
  );
  console.log(
    "- Se for utilizar push ups, crie dentro de android/app o arquivo google-services.json e cola o conteúdo do arquivo gerado pelo firebase, não esqueça de colocar o \
    secret json do firebase",
  );
}

function writeAndroidLocalProperties() {
  const sdk = process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME;
  let sdkDir = sdk;

  // fallback padrão Windows
  if (!sdkDir) {
    const userProfile = process.env.USERPROFILE; // C:\Users\Utilizador
    if (userProfile) {
      const guess = path.join(
        userProfile,
        "AppData",
        "Local",
        "Android",
        "Sdk",
      );
      if (fs.existsSync(guess)) sdkDir = guess;
    }
  }

  if (!sdkDir) {
    console.warn(
      "\n[warn] Não consegui detectar Android SDK automaticamente. " +
        "Configure ANDROID_SDK_ROOT/ANDROID_HOME ou crie android/local.properties manualmente.\n",
    );
    return;
  }

  const lpPath = path.join(cwd, "android", "local.properties");
  const escaped = sdkDir.replace(/\\/g, "\\\\"); // barras duplas
  fs.writeFileSync(lpPath, `sdk.dir=${escaped}\n`, "utf8");
  console.log(`[ok] local.properties criado: ${lpPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
