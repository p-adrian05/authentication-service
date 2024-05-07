const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class InitSchema1715096564166 {
    name = 'InitSchema1715096564166'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "roles" ADD "isDefault" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "isDefault"`);
    }
}
