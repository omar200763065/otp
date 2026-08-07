import { PrismaClient, Role, KeyType, IpRuleType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding OTP SaaS Platform Database...');

  // 1. Initial Admin User
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@otpsaas.com';
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'AdminPassword123!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Super Admin',
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log(`✅ Admin User created: ${adminUser.email}`);

  // 2. Default Tenant
  const tenant = await prisma.tenant.upsert({
    where: { email: 'demo@organization.com' },
    update: {},
    create: {
      name: 'Default Enterprise Org',
      email: 'demo@organization.com',
      companyName: 'Madar Tech Enterprise',
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Tenant created: ${tenant.name}`);

  // 3. Default App
  const app = await prisma.app.upsert({
    where: { slug: 'default-mobile-app' },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Main Customer App',
      slug: 'default-mobile-app',
      description: 'Primary Android, iOS & Web Application',
      isActive: true,
    },
  });
  console.log(`✅ App created: ${app.name}`);

  // 4. Default Live API Key
  const rawKey = 'otp_live_demo_key_998877665544332211';
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

  const apiKey = await prisma.apiKey.upsert({
    where: { keyHash },
    update: {},
    create: {
      appId: app.id,
      name: 'Production Primary Key',
      keyPrefix: 'otp_live_demo',
      keyHash,
      type: KeyType.LIVE,
      isActive: true,
    },
  });
  console.log(`✅ API Key created: ${apiKey.name} (Raw Key for testing: ${rawKey})`);

  // 5. Default WhatsApp Config
  const waConfig = await prisma.whatsAppConfig.create({
    data: {
      tenantId: tenant.id,
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '123456789012345',
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '123456789012345',
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || 'EAAG...DEFAULT_TOKEN',
      senderPhoneNumber: '+966500000000',
      isActive: true,
    },
  });
  console.log(`✅ WhatsApp Configuration created ID: ${waConfig.id}`);

  // 6. Default Message Template
  await prisma.messageTemplate.create({
    data: {
      whatsappConfigId: waConfig.id,
      name: 'otp_verification_code',
      language: 'ar',
      bodyText: 'رمز التحقق الخاص بك لمنصة الأمان هو: {{1}}. ينتهي الكود خلال 5 دقائق.',
      category: 'AUTHENTICATION',
      status: 'APPROVED',
    },
  });
  console.log('✅ Default WhatsApp Message Template created');

  // 7. Default Whitelist & Blacklist Rules
  await prisma.ipRule.createMany({
    data: [
      {
        type: IpRuleType.WHITELIST,
        value: '127.0.0.1',
        reason: 'Localhost server testing',
      },
      {
        type: IpRuleType.BLACKLIST,
        value: '192.168.99.99',
        reason: 'Known suspicious bot subnet',
      },
    ],
  });
  console.log('✅ Default IP Rules created');

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
