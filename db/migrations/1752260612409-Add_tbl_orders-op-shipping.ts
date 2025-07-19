import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTblOrdersOpShipping1752260612409 implements MigrationInterface {
    name = 'AddTblOrdersOpShipping1752260612409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shippings" ("id" SERIAL NOT NULL, "phone" character varying NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "postalCode" character varying NOT NULL, "country" character varying NOT NULL, "state" character varying NOT NULL, CONSTRAINT "PK_665fb613135782a598a2b47e5b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders_products" ("id" SERIAL NOT NULL, "product_unit_price" numeric(10,2) NOT NULL DEFAULT '0', "product_quantity" integer NOT NULL, "orderId" integer, "productId" integer, CONSTRAINT "PK_4945c6758fd65ffacda760b4ac9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "orderAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."orders_status_enum" NOT NULL DEFAULT 'processing', "shippedAt" TIMESTAMP, "deliveredAt" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "ordersUpdatedById" integer, "shippingInfoId" integer, CONSTRAINT "REL_acd5828255caa15b5571e1b01f" UNIQUE ("shippingInfoId"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders_products" ADD CONSTRAINT "FK_823bad3524a5d095453c43286bb" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders_products" ADD CONSTRAINT "FK_4eff63e89274f79195e25c5c115" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_2202d2505b0206801fcb129dcaa" FOREIGN KEY ("ordersUpdatedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_acd5828255caa15b5571e1b01fb" FOREIGN KEY ("shippingInfoId") REFERENCES "shippings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_acd5828255caa15b5571e1b01fb"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_2202d2505b0206801fcb129dcaa"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "orders_products" DROP CONSTRAINT "FK_4eff63e89274f79195e25c5c115"`);
        await queryRunner.query(`ALTER TABLE "orders_products" DROP CONSTRAINT "FK_823bad3524a5d095453c43286bb"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "orders_products"`);
        await queryRunner.query(`DROP TABLE "shippings"`);
    }

}
