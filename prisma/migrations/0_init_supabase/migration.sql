-- CreateTable
CREATE TABLE "products" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT,
    "brand" TEXT,
    "type" TEXT,
    "link" TEXT,
    "img_link" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shades" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT,
    "name" TEXT,
    "hex" TEXT,
    "r" SMALLINT,
    "g" SMALLINT,
    "b" SMALLINT,

    CONSTRAINT "shades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_loadouts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mongo_id" TEXT,
    "name" TEXT,
    "foundation_shade_id" BIGINT,

    CONSTRAINT "user_loadouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mongo_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "budget" INTEGER DEFAULT 0,
    "skin_type" TEXT,
    "is_private" BOOLEAN DEFAULT true,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_recommendations" (
    "mongo_id" TEXT,
    "shade_id" BIGINT,
    "shade_score" REAL,
    "skintype_score" REAL,
    "created_at" TIMESTAMPTZ(6) DEFAULT (now() AT TIME ZONE 'utc'::text),
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "user_recommendations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shades" ADD CONSTRAINT "shades_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_loadouts" ADD CONSTRAINT "user_loadouts_foundation_shade_id_fkey" FOREIGN KEY ("foundation_shade_id") REFERENCES "shades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_recommendations" ADD CONSTRAINT "user_reccomendations_shade_id_fkey" FOREIGN KEY ("shade_id") REFERENCES "shades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

