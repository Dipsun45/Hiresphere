const fs = require('fs');
const logPath = 'C:/Users/Admin/.gemini/antigravity-ide/brain/28818ba6-da87-4313-8af0-53fdb504e01c/.system_generated/logs/transcript_full.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

const fileStates = {};

function applyEdit(content, target, replacement, allowMultiple, startLine, endLine) {
    if (!content) return content;
    const lines = content.split('\n');
    let startIdx = 0;
    let endIdx = lines.length - 1;
    if (startLine && endLine) {
        startIdx = startLine - 1;
        endIdx = endLine - 1;
    }
    const chunk = lines.slice(startIdx, endIdx + 1).join('\n');
    if (allowMultiple) {
        return content.substring(0, content.indexOf(chunk)) + chunk.split(target).join(replacement) + content.substring(content.indexOf(chunk) + chunk.length);
    } else {
        return content.substring(0, content.indexOf(chunk)) + chunk.replace(target, replacement) + content.substring(content.indexOf(chunk) + chunk.length);
    }
}

for (const line of lines) {
    if (!line) continue;
    try {
        const data = JSON.parse(line);
        if (data.tool_calls) {
            for (const call of data.tool_calls) {
                let name = call.name;
                if (name === 'default_api:write_to_file') name = 'write_to_file';
                if (name === 'default_api:replace_file_content') name = 'replace_file_content';
                if (name === 'default_api:multi_replace_file_content') name = 'multi_replace_file_content';

                const args = typeof call.arguments === 'string' ? JSON.parse(call.arguments) : call.arguments;

                if (name === 'write_to_file' && args && args.TargetFile) {
                    fileStates[args.TargetFile] = args.CodeContent;
                } else if (name === 'replace_file_content' && args && args.TargetFile) {
                    if (fileStates[args.TargetFile]) {
                        fileStates[args.TargetFile] = applyEdit(
                            fileStates[args.TargetFile],
                            args.TargetContent,
                            args.ReplacementContent,
                            args.AllowMultiple,
                            args.StartLine,
                            args.EndLine
                        );
                    }
                } else if (name === 'multi_replace_file_content' && args && args.TargetFile && args.ReplacementChunks) {
                    if (fileStates[args.TargetFile]) {
                        for (const chunk of args.ReplacementChunks) {
                            fileStates[args.TargetFile] = applyEdit(
                                fileStates[args.TargetFile],
                                chunk.TargetContent,
                                chunk.ReplacementContent,
                                chunk.AllowMultiple,
                                chunk.StartLine,
                                chunk.EndLine
                            );
                        }
                    }
                }
            }
        }
    } catch(e) {}
}

const targetFiles = ['Home.jsx', 'Message.jsx', 'Profile.jsx', 'RecruitmentDrive.jsx', 'AppliedDrives.jsx', 'CompanyProfile.jsx'];
for (const file of targetFiles) {
    let found = false;
    for (const key of Object.keys(fileStates)) {
        if (key.endsWith(file) && !key.includes('restored_')) {
            console.log(`Restoring ${file} (${fileStates[key].length} chars)...`);
            fs.writeFileSync('src/pages/' + file, fileStates[key]);
            found = true;
        }
    }
    if (!found) {
        console.log(`Warning: ${file} not found in state history.`);
    }
}
