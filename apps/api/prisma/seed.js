"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const email = 'owner@example.com';
    const passwordHash = await bcrypt_1.default.hash('ChangeMe123!', 12);
    const user = await prisma.user.upsert({
        where: { email },
        create: { email, passwordHash, name: 'Owner' },
        update: {}
    });
    const workspace = await prisma.workspace.create({
        data: { name: 'Default Workspace' }
    });
    await prisma.workspaceMember.create({
        data: {
            workspaceId: workspace.id,
            userId: user.id,
            role: client_1.WorkspaceRole.OWNER
        }
    });
    console.log('Seeded user:', email);
}
main()
    .catch((err) => {
    console.error(err);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
