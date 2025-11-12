billing_saas-# \d+ public.*
                                                           Table "public.client"
  Column   |            Type             | Collation | Nullable |      Default       | Storage  | Compression | Stats target | Description
-----------+-----------------------------+-----------+----------+--------------------+----------+-------------+--------------+-------------
 id        | uuid                        |           | not null | uuid_generate_v4() | plain    |             |              |
 name      | character varying(255)      |           | not null |                    | extended |             |              |
 email     | character varying(255)      |           | not null |                    | extended |             |              |
 phone     | character varying(50)       |           |          |                    | extended |             |              |
 address   | text                        |           |          |                    | extended |             |              |
 taxId     | character varying(100)      |           |          |                    | extended |             |              |
 tenantId  | uuid                        |           |          |                    | plain    |             |              |
 createdAt | timestamp without time zone |           |          | CURRENT_TIMESTAMP  | plain    |             |              |
 updatedAt | timestamp without time zone |           |          | CURRENT_TIMESTAMP  | plain    |             |              |
Indexes:
    "client_pkey" PRIMARY KEY, btree (id)
    "idx_client_tenant" btree ("tenantId")
Foreign-key constraints:
    "client_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES tenant(id) ON DELETE CASCADE
Access method: heap


                 Index "public.client_pkey"
 Column | Type | Key? | Definition | Storage | Stats target
--------+------+------+------------+---------+--------------
 id     | uuid | yes  | id         | plain   |
primary key, btree, for table "public.client"


                                                                   Table "public.gstins"
   Column   |            Type             | Collation | Nullable |              Default               | Storage  | Compression | Stats target | Description
------------+-----------------------------+-----------+----------+------------------------------------+----------+-------------+--------------+-------------
 id         | integer                     |           | not null | nextval('gstins_id_seq'::regclass) | plain    |             |              |
 gstin      | character varying(255)      |           | not null |                                    | extended |             |              |
 legalname  | character varying(255)      |           | not null |                                    | extended |             |              |
 tradename  | character varying(255)      |           | not null |                                    | extended |             |              |
 address    | jsonb                       |           | not null |                                    | extended |             |              |
 statecode  | character varying(10)       |           | not null |                                    | extended |             |              |
 isactive   | boolean                     |           |          | true                               | plain    |             |              |
 isprimary  | boolean                     |           |          | false                              | plain    |             |              |
 authstatus | jsonb                       |           |          |                                    | extended |             |              |
 tenantId   | uuid                        |           | not null |                                    | plain    |             |              |
 createdAt  | timestamp without time zone |           |          | CURRENT_TIMESTAMP                  | plain    |             |              |
 updatedAt  | timestamp without time zone |           |          | CURRENT_TIMESTAMP                  | plain    |             |              |
Indexes:
    "gstins_pkey" PRIMARY KEY, btree (id)
    "idx_gstin_number" btree (gstin)
    "idx_gstin_tenant" btree ("tenantId")
Foreign-key constraints:
    "fk_tenant" FOREIGN KEY ("tenantId") REFERENCES tenant(id) ON DELETE CASCADE
Access method: heap


                   Sequence "public.gstins_id_seq"
  Type   | Start | Minimum |  Maximum   | Increment | Cycles? | Cache
---------+-------+---------+------------+-----------+---------+-------
 integer |     1 |       1 | 2147483647 |         1 | no      |     1
Owned by: public.gstins.id


                  Index "public.gstins_pkey"
 Column |  Type   | Key? | Definition | Storage | Stats target
--------+---------+------+------------+---------+--------------
 id     | integer | yes  | id         | plain   |
primary key, btree, for table "public.gstins"


                                                                    Table "public.hsn_codes"
   Column    |            Type             | Collation | Nullable |                Default                | Storage  | Compression | Stats target | Description
-------------+-----------------------------+-----------+----------+---------------------------------------+----------+-------------+--------------+-------------
 id          | integer                     |           | not null | nextval('hsn_codes_id_seq'::regclass) | plain    |             |              |
 code        | character varying(50)       |           | not null |                                       | extended |             |              |
 description | text                        |           | not null |                                       | extended |             |              |
 gstrate     | numeric(5,2)                |           | not null |                                       | main     |             |              |
 cessrate    | numeric(5,2)                |           |          |                                       | main     |             |              |
 isactive    | boolean                     |           |          | true                                  | plain    |             |              |
 tenantid    | uuid                        |           | not null |                                       | plain    |             |              |
 createdat   | timestamp without time zone |           |          | CURRENT_TIMESTAMP                     | plain    |             |              |
 updatedat   | timestamp without time zone |           |          | CURRENT_TIMESTAMP                     | plain    |             |              |
Indexes:
    "hsn_codes_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "fk_tenant" FOREIGN KEY (tenantid) REFERENCES tenant(id)
Referenced by:
    TABLE "products" CONSTRAINT "fk_hsn" FOREIGN KEY (hsnid) REFERENCES hsn_codes(id)
    TABLE "invoice_items" CONSTRAINT "invoice_items_hsnid_fkey" FOREIGN KEY (hsnid) REFERENCES hsn_codes(id)
Access method: heap


                  Sequence "public.hsn_codes_id_seq"
  Type   | Start | Minimum |  Maximum   | Increment | Cycles? | Cache
---------+-------+---------+------------+-----------+---------+-------
 integer |     1 |       1 | 2147483647 |         1 | no      |     1
Owned by: public.hsn_codes.id


                 Index "public.hsn_codes_pkey"
 Column |  Type   | Key? | Definition | Storage | Stats target
--------+---------+------+------------+---------+--------------
 id     | integer | yes  | id         | plain   |
primary key, btree, for table "public.hsn_codes"


               Index "public.idx_client_tenant"
  Column  | Type | Key? | Definition | Storage | Stats target
----------+------+------+------------+---------+--------------
 tenantId | uuid | yes  | "tenantId" | plain   |
btree, for table "public.client"


                        Index "public.idx_gstin_number"
 Column |          Type          | Key? | Definition | Storage  | Stats target
--------+------------------------+------+------------+----------+--------------
 gstin  | character varying(255) | yes  | gstin      | extended |
btree, for table "public.gstins"


               Index "public.idx_gstin_tenant"
  Column  | Type | Key? | Definition | Storage | Stats target
----------+------+------+------------+---------+--------------
 tenantId | uuid | yes  | "tenantId" | plain   |
btree, for table "public.gstins"


             Index "public.idx_invoice_due_date"
 Column  | Type | Key? | Definition | Storage | Stats target
---------+------+------+------------+---------+--------------
 dueDate | date | yes  | "dueDate"  | plain   |
btree, for table "public.invoice"


                      Index "public.idx_invoice_status"
 Column |         Type          | Key? | Definition | Storage  | Stats target
--------+-----------------------+------+------------+----------+--------------
 status | character varying(50) | yes  | status     | extended |
btree, for table "public.invoice"


              Index "public.idx_invoice_tenant"
  Column  | Type | Key? | Definition | Storage | Stats target
----------+------+------+------------+---------+--------------
 tenantId | uuid | yes  | "tenantId" | plain   |
btree, for table "public.invoice"


            Index "public.idx_notification_user"
 Column | Type | Key? | Definition | Storage | Stats target
--------+------+------+------------+---------+--------------
 userId | uuid | yes  | "userId"   | plain   |
btree, for table "public.notification"


              Index "public.idx_sync_log_tenant"
  Column  | Type | Key? | Definition | Storage | Stats target
----------+------+------+------------+---------+--------------
 tenantId | uuid | yes  | "tenantId" | plain   |
btree, for table "public.syncLog"


              Index "public.idx_sync_log_user"
 Column | Type | Key? | Definition | Storage | Stats target
--------+------+------+------------+---------+--------------
 userId | uuid | yes  | "userId"   | plain   |
btree, for table "public.syncLog"


                Index "public.idx_user_tenant"
  Column  | Type | Key? | Definition | Storage | Stats target
----------+------+------+------------+---------+--------------
 tenantId | uuid | yes  | "tenantId" | plain   |
btree, for table "public.user"


                                                                Table "public.invoice"
    Column     |            Type             | Collation | Nullable |          Default           | Storage  | Compression | Stats target | Description
---------------+-----------------------------+-----------+----------+----------------------------+----------+-------------+--------------+-------------
 id            | uuid                        |           | not null | uuid_generate_v4()         | plain    |             |              |
 invoiceNumber | character varying(255)      |           | not null |                            | extended |             |              |
 clientName    | character varying(255)      |           | not null |                            | extended |             |              |
 amount        | numeric(10,2)               |           | not null |                            | main     |             |              |
 dueDate       | date                        |           | not null |                            | plain    |             |              |
 status        | character varying(50)       |           |          | 'draft'::character varying | extended |             |              |
 items         | jsonb                       |           |          |                            | extended |             |              |
 tenantId      | uuid                        |           |          |                            | plain    |             |              |
 createdAt     | timestamp without time zone |           |          | CURRENT_TIMESTAMP          | plain    |             |              |
 updatedAt     | timestamp without time zone |           |          | CURRENT_TIMESTAMP          | plain    |             |              |
Indexes:
    "invoice_pkey" PRIMARY KEY, btree (id)
    "idx_invoice_due_date" btree ("dueDate")
    "idx_invoice_status" btree (status)
    "idx_invoice_tenant" btree ("tenantId")
Foreign-key constraints:
    "invoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES tenant(id) ON DELETE CASCADE
Referenced by:
    TABLE "invoice_items" CONSTRAINT "invoice_items_invoiceid_fkey" FOREIGN KEY (invoiceid) REFERENCES invoice(id) ON DELETE CASCADE
Access method: heap


                                                                    Table "public.invoice_items"
   Column    |            Type             | Collation | Nullable |                  Default                  | Storage  | Compression | Stats target | Description
-------------+-----------------------------+-----------+----------+-------------------------------------------+----------+-------------+--------------+-------------
 id          | integer                     |           | not null | nextval('invoice_items_id_seq'::regclass) | plain    |             |              |
 description | character varying(255)      |           | not null |                                           | extended |             |              |
 quantity    | numeric(10,2)               |           | not null |                                           | main     |             |              |
 unit        | character varying(50)       |           | not null |                                           | extended |             |              |
 unitprice   | numeric(15,2)               |           | not null |                                           | main     |             |              |
 amount      | numeric(15,2)               |           | not null |                                           | main     |             |              |
 taxrate     | numeric(5,2)                |           | not null |                                           | main     |             |              |
 taxamount   | numeric(15,2)               |           | not null |                                           | main     |             |              |
 cessrate    | numeric(5,2)                |           |          |                                           | main     |             |              |
 cessamount  | numeric(15,2)               |           |          | 0                                         | main     |             |              |
 metadata    | jsonb                       |           |          |                                           | extended |             |              |
 invoiceid   | uuid                        |           | not null |                                           | plain    |             |              |
 productid   | integer                     |           | not null |                                           | plain    |             |              |
 hsnid       | integer                     |           | not null |                                           | plain    |             |              |
 tenantid    | uuid                        |           | not null |                                           | plain    |             |              |
 createdat   | timestamp without time zone |           |          | CURRENT_TIMESTAMP                         | plain    |             |              |
 updatedat   | timestamp without time zone |           |          | CURRENT_TIMESTAMP                         | plain    |             |              |
Indexes:
    "invoice_items_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "invoice_items_hsnid_fkey" FOREIGN KEY (hsnid) REFERENCES hsn_codes(id)
    "invoice_items_invoiceid_fkey" FOREIGN KEY (invoiceid) REFERENCES invoice(id) ON DELETE CASCADE
    "invoice_items_productid_fkey" FOREIGN KEY (productid) REFERENCES products(id)
    "invoice_items_tenantid_fkey" FOREIGN KEY (tenantid) REFERENCES tenant(id)
Access method: heap


                Sequence "public.invoice_items_id_seq"
  Type   | Start | Minimum |  Maximum   | Increment | Cycles? | Cache
---------+-------+---------+------------+-----------+---------+-------
 integer |     1 |       1 | 2147483647 |         1 | no      |     1
Owned by: public.invoice_items.id


               Index "public.invoice_items_pkey"
 Column |  Type   | Key? | Definition | Storage | Stats target
--------+---------+------+------------+---------+--------------
 id     | integer | yes  | id         | plain   |
primary key, btree, for table "public.invoice_items"


                Index "public.invoice_pkey"
 Column | Type | Key? | Definition | Storage | Stats target
--------+------+------+------------+---------+--------------
 id     | uuid | yes  | id         | plain   |
primary key, btree, for table "public.invoice"


                                                            Table "public.notification"
  Column   |            Type             | Collation | Nullable |           Default           | Storage  | Compression | Stats target | Description
-----------+-----------------------------+-----------+----------+-----------------------------+----------+-------------+--------------+-------------
 id        | uuid                        |           | not null | uuid_generate_v4()          | plain    |             |              |
 title     | character varying(255)      |           | not null |                             | extended |             |              |
 body      | text                        |           | not null |                             | extended |             |              |
 data      | jsonb                       |           |          |                             | extended |             |              |
 isRead    | boolean                     |           |          | false                       | plain    |             |              |
 type      | character varying(100)      |           |          |                             | extended |             |              |
 priority  | character varying(50)       |           |          | 'normal'::character varying | extended |             |              |
 userId    | uuid                        |           |          |                             | plain    |             |              |
 createdAt | timestamp without time zone |           |          | CURRENT_TIMESTAMP           | plain    |             |              |
Indexes:
    "notification_pkey" PRIMARY KEY, btree (id)
    "idx_notification_user" btree ("userId")
Foreign-key constraints:
    "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
Access method: heap


              Index "public.notification_pkey"
 Column | Type | Key? | Definition | Storage | Stats target
--------+------+------+------------+---------+--------------
 id     | uuid | yes  | id         | plain   |
primary key, btree, for table "public.notification"


                                                                    Table "public.products"
   Column    |            Type             | Collation | Nullable |               Default                | Storage  | Compression | Stats target | Description
-------------+-----------------------------+-----------+----------+--------------------------------------+----------+-------------+--------------+-------------
 id          | integer                     |           | not null | nextval('products_id_seq'::regclass) | plain    |             |              |
 name        | character varying(255)      |           | not null |                                      | extended |             |              |
 description | text                        |           |          |                                      | extended |             |              |
 type        | product_type                |           |          | 'service'::product_type              | plain    |             |              |
 price       | numeric(15,2)               |           | not null |                                      | main     |             |              |
 currency    | character varying(10)       |           | not null |                                      | extended |             |              |
 isactive    | boolean                     |           |          | true                                 | plain    |             |              |
 sku         | character varying(255)      |           |          |                                      | extended |             |              |
 metadata    | jsonb                       |           |          |                                      | extended |             |              |
 tenantid    | uuid                        |           | not null |                                      | plain    |             |              |
 hsnid       | integer                     |           | not null |                                      | plain    |             |              |
 createdat   | timestamp without time zone |           |          | CURRENT_TIMESTAMP                    | plain    |             |              |
 updatedat   | timestamp without time zone |           |          | CURRENT_TIMESTAMP                    | plain    |             |              |
Indexes:
    "products_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "fk_hsn" FOREIGN KEY (hsnid) REFERENCES hsn_codes(id)
    "fk_tenant" FOREIGN KEY (tenantid) REFERENCES tenant(id)
Referenced by:
    TABLE "invoice_items" CONSTRAINT "invoice_items_productid_fkey" FOREIGN KEY (productid) REFERENCES products(id)
Access method: heap


                  Sequence "public.products_id_seq"
  Type   | Start | Minimum |  Maximum   | Increment | Cycles? | Cache
---------+-------+---------+------------+-----------+---------+-------
 integer |     1 |       1 | 2147483647 |         1 | no      |     1
Owned by: public.products.id


                 Index "public.products_pkey"
 Column |  Type   | Key? | Definition | Storage | Stats target
--------+---------+------+------------+---------+--------------
 id     | integer | yes  | id         | plain   |
primary key, btree, for table "public.products"


                                                                 Table "public.subscriptions"
        Column        |           Type           | Collation | Nullable |            Default            | Storage  | Compression | Stats target | Description
----------------------+--------------------------+-----------+----------+-------------------------------+----------+-------------+--------------+-------------
 id                   | uuid                     |           | not null | gen_random_uuid()             | plain    |             |              |
 tenantId             | uuid                     |           | not null |                               | plain    |             |              |
 name                 | character varying        |           | not null |                               | extended |             |              |
 description          | text                     |           |          |                               | extended |             |              |
 status               | character varying        |           | not null | 'trialing'::character varying | extended |             |              |
 billingCycle         | character varying        |           | not null | 'monthly'::character varying  | extended |             |              |
 price                | numeric(10,2)            |           | not null |                               | main     |             |              |
 features             | jsonb                    |           |          | '[]'::jsonb                   | extended |             |              |
 userLimit            | integer                  |           |          | 1                             | plain    |             |              |
 invoiceLimit         | integer                  |           |          | 0                             | plain    |             |              |
 isActive             | boolean                  |           |          | false                         | plain    |             |              |
 currentPeriodStart   | timestamp with time zone |           |          |                               | plain    |             |              |
 currentPeriodEnd     | timestamp with time zone |           |          |                               | plain    |             |              |
 cancelAt             | timestamp with time zone |           |          |                               | plain    |             |              |
 cancelAtPeriodEnd    | boolean                  |           |          | false                         | plain    |             |              |
 stripeSubscriptionId | character varying        |           |          |                               | extended |             |              |
 stripeCustomerId     | character varying        |           |          |                               | extended |             |              |
 stripePriceId        | character varying        |           |          |                               | extended |             |              |
 createdAt            | timestamp with time zone |           |          | now()                         | plain    |             |              |
 updatedAt            | timestamp with time zone |           |          | now()                         | plain    |             |              |
Indexes:
    "subscriptions_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "fk_tenant" FOREIGN KEY ("tenantId") REFERENCES tenant(id) ON DELETE CASCADE
Access method: heap


             Index "public.subscriptions_pkey"
 Column | Type | Key? | Definition | Storage | Stats target
--------+------+------+------------+---------+--------------
 id     | uuid | yes  | id         | plain   |
primary key, btree, for table "public.subscriptions"


                                                          Table "public.syncLog"
  Column   |            Type             | Collation | Nullable |      Default       | Storage  | Compression | Stats target | Description
-----------+-----------------------------+-----------+----------+--------------------+----------+-------------+--------------+-------------
 id        | uuid                        |           | not null | uuid_generate_v4() | plain    |             |              |
 results   | jsonb                       |           | not null |                    | extended |             |              |
 tenantId  | uuid                        |           |          |                    | plain    |             |              |
 userId    | uuid                        |           |          |                    | plain    |             |              |
 timestamp | timestamp without time zone |           |          | CURRENT_TIMESTAMP  | plain    |             |              |
Indexes:
    "syncLog_pkey" PRIMARY KEY, btree (id)
    "idx_sync_log_tenant" btree ("tenantId")
    "idx_sync_log_user" btree ("userId")
Foreign-key constraints:
    "syncLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES tenant(id) ON DELETE CASCADE
    "syncLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
Access method: heap


                Index "public.syncLog_pkey"
 Column | Type | Key? | Definition | Storage | Stats target
--------+------+------+------------+---------+--------------
 id     | uuid | yes  | id         | plain   |
primary key, btree, for table "public.syncLog"


                                                           Table "public.tenant"
  Column   |            Type             | Collation | Nullable |      Default       | Storage  | Compression | Stats target | Description
-----------+-----------------------------+-----------+----------+--------------------+----------+-------------+--------------+-------------
 id        | uuid                        |           | not null | uuid_generate_v4() | plain    |             |              |
 name      | character varying(255)      |           | not null |                    | extended |             |              |
 subdomain | character varying(255)      |           | not null |                    | extended |             |              |
 isActive  | boolean                     |           |          | true               | plain    |             |              |
 createdAt | timestamp without time zone |           |          | CURRENT_TIMESTAMP  | plain    |             |              |
 updatedAt | timestamp without time zone |           |          | CURRENT_TIMESTAMP  | plain    |             |              |
Indexes:
    "tenant_pkey" PRIMARY KEY, btree (id)
    "tenant_subdomain_key" UNIQUE CONSTRAINT, btree (subdomain)
Referenced by:
    TABLE "client" CONSTRAINT "client_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES tenant(id) ON DELETE CASCADE
    TABLE "gstins" CONSTRAINT "fk_tenant" FOREIGN KEY ("tenantId") REFERENCES tenant(id) ON DELETE CASCADE
    TABLE "products" CONSTRAINT "fk_tenant" FOREIGN KEY (tenantid) REFERENCES tenant(id)
    TABLE "hsn_codes" CONSTRAINT "fk_tenant" FOREIGN KEY (tenantid) REFERENCES tenant(id)
    TABLE "subscriptions" CONSTRAINT "fk_tenant" FOREIGN KEY ("tenantId") REFERENCES tenant(id) ON DELETE CASCADE
    TABLE "invoice_items" CONSTRAINT "invoice_items_tenantid_fkey" FOREIGN KEY (tenantid) REFERENCES tenant(id)
    TABLE "invoice" CONSTRAINT "invoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES tenant(id) ON DELETE CASCADE
    TABLE ""syncLog"" CONSTRAINT "syncLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES tenant(id) ON DELETE CASCADE
    TABLE ""user"" CONSTRAINT "user_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES tenant(id) ON DELETE CASCADE
Access method: heap


                 Index "public.tenant_pkey"
 Column | Type | Key? | Definition | Storage | Stats target
--------+------+------+------------+---------+--------------
 id     | uuid | yes  | id         | plain   |
primary key, btree, for table "public.tenant"


                       Index "public.tenant_subdomain_key"
  Column   |          Type          | Key? | Definition | Storage  | Stats target
-----------+------------------------+------+------------+----------+--------------
 subdomain | character varying(255) | yes  | subdomain  | extended |
unique, btree, for table "public.tenant"


                                                                   Table "public.user"
      Column      |            Type             | Collation | Nullable |          Default          | Storage  | Compression | Stats target | Description
------------------+-----------------------------+-----------+----------+---------------------------+----------+-------------+--------------+-------------
 id               | uuid                        |           | not null | uuid_generate_v4()        | plain    |             |              |
 email            | character varying(255)      |           | not null |                           | extended |             |              |
 password         | character varying(255)      |           | not null |                           | extended |             |              |
 firstName        | character varying(255)      |           | not null |                           | extended |             |              |
 lastName         | character varying(255)      |           | not null |                           | extended |             |              |
 pushToken        | text                        |           |          |                           | extended |             |              |
 role             | character varying(50)       |           |          | 'user'::character varying | extended |             |              |
 biometricEnabled | boolean                     |           |          | false                     | plain    |             |              |
 tenantId         | uuid                        |           |          |                           | plain    |             |              |
 createdAt        | timestamp without time zone |           |          | CURRENT_TIMESTAMP         | plain    |             |              |
 updatedAt        | timestamp without time zone |           |          | CURRENT_TIMESTAMP         | plain    |             |              |
Indexes:
    "user_pkey" PRIMARY KEY, btree (id)
    "idx_user_tenant" btree ("tenantId")
    "user_email_key" UNIQUE CONSTRAINT, btree (email)
Foreign-key constraints:
    "user_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES tenant(id) ON DELETE CASCADE
Referenced by:
    TABLE "notification" CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
    TABLE ""syncLog"" CONSTRAINT "syncLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
Access method: heap


                         Index "public.user_email_key"
 Column |          Type          | Key? | Definition | Storage  | Stats target
--------+------------------------+------+------------+----------+--------------
 email  | character varying(255) | yes  | email      | extended |
unique, btree, for table "public.user"


                  Index "public.user_pkey"
 Column | Type | Key? | Definition | Storage | Stats target
--------+------+------+------------+---------+--------------
 id     | uuid | yes  | id         | plain   |
primary key, btree, for table "public.user"





according to the table structure update the entities and give me the draft here