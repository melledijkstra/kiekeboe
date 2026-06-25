import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workflowsDir = path.join(__dirname, '..', 'workflows');
const TARGET_EMAIL = 'melle.dykstra@gmail.com';
const ENV_REPLACEMENT = '={{ $env.RECIPIENT_EMAIL }}';

function sanitizeObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        if (value === TARGET_EMAIL) {
          newObj[key] = ENV_REPLACEMENT;
        } else {
          // Also handle cases where the email is part of a larger string or has different casing
          newObj[key] = value.replace(new RegExp(TARGET_EMAIL, 'gi'), '{{ $env.RECIPIENT_EMAIL }}');
        }
      } else {
        newObj[key] = sanitizeObject(value);
      }
    }
    return newObj;
  }
  return obj;
}

if (!fs.existsSync(workflowsDir)) {
  console.log(`Workflows directory not found at ${workflowsDir}`);
  process.exit(0);
}

fs.readdirSync(workflowsDir).forEach(file => {
  if (path.extname(file) !== '.json') return;
  const filePath = path.join(workflowsDir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let workflow = JSON.parse(content);

    // Strip the "shared" metadata which contains personal details and local IDs
    if ('shared' in workflow) {
      workflow.shared = [];
    }

    // Recursively sanitize occurrences of the target email
    workflow = sanitizeObject(workflow);

    // Write back the sanitized JSON with pretty formatting (2-space indent)
    const sanitizedContent = JSON.stringify(workflow, null, 2) + '\n';
    fs.writeFileSync(filePath, sanitizedContent, 'utf8');

    // Scan for any left-over potential personal details or emails as a safety warning
    if (sanitizedContent.includes('melle.dykstra') || sanitizedContent.includes('dijksmel')) {
      console.warn(`⚠️ Warning: Potential leftover secret or personal name found in ${file}`);
    } else {
      console.log(`✅ Sanitized ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error sanitizing ${file}:`, error);
  }
});
