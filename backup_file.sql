--
-- PostgreSQL database dump
--

\restrict rnv8tPThEMaheH1LEcO4EQWlMBuY2Av9foffDeWpKdwawUjSvHXanU7LWmTiYAD

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: audit_log_action_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.audit_log_action_enum AS ENUM (
    'create',
    'update',
    'delete',
    'login',
    'logout',
    'export'
);


ALTER TYPE public.audit_log_action_enum OWNER TO postgres;

--
-- Name: audit_log_resource_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.audit_log_resource_enum AS ENUM (
    'user',
    'tenant',
    'professional',
    'subscription',
    'system'
);


ALTER TYPE public.audit_log_resource_enum OWNER TO postgres;

--
-- Name: billing_cycle_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.billing_cycle_enum AS ENUM (
    'monthly',
    'quarterly',
    'yearly'
);


ALTER TYPE public.billing_cycle_enum OWNER TO postgres;

--
-- Name: customer_loyalty_currenttier_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.customer_loyalty_currenttier_enum AS ENUM (
    'bronze',
    'silver',
    'gold',
    'platinum'
);


ALTER TYPE public.customer_loyalty_currenttier_enum OWNER TO postgres;

--
-- Name: customer_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.customer_type AS ENUM (
    'business',
    'individual'
);


ALTER TYPE public.customer_type OWNER TO postgres;

--
-- Name: customers_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.customers_type_enum AS ENUM (
    'business',
    'individual'
);


ALTER TYPE public.customers_type_enum OWNER TO postgres;

--
-- Name: expenses_category_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.expenses_category_enum AS ENUM (
    'office_supplies',
    'travel',
    'utilities',
    'salary',
    'marketing',
    'software',
    'hardware',
    'rent',
    'maintenance',
    'other'
);


ALTER TYPE public.expenses_category_enum OWNER TO postgres;

--
-- Name: expenses_paymentmethod_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.expenses_paymentmethod_enum AS ENUM (
    'cash',
    'bank_transfer',
    'cheque',
    'card',
    'online'
);


ALTER TYPE public.expenses_paymentmethod_enum OWNER TO postgres;

--
-- Name: invoice_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.invoice_type_enum AS ENUM (
    'tax_invoice',
    'bill_of_supply',
    'export',
    'sez',
    'debit_note',
    'credit_note'
);


ALTER TYPE public.invoice_type_enum OWNER TO postgres;

--
-- Name: invoices_paymentterms_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.invoices_paymentterms_enum AS ENUM (
    'due_on_receipt',
    'net_7',
    'net_15',
    'net_30',
    'net_60'
);


ALTER TYPE public.invoices_paymentterms_enum OWNER TO postgres;

--
-- Name: invoices_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.invoices_status_enum AS ENUM (
    'draft',
    'sent',
    'viewed',
    'partial',
    'paid',
    'overdue',
    'cancelled',
    'open',
    'pending'
);


ALTER TYPE public.invoices_status_enum OWNER TO postgres;

--
-- Name: invoices_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.invoices_type_enum AS ENUM (
    'standard',
    'proforma',
    'credit',
    'debit'
);


ALTER TYPE public.invoices_type_enum OWNER TO postgres;

--
-- Name: loyalty_programs_rewardtype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.loyalty_programs_rewardtype_enum AS ENUM (
    'cashback',
    'points',
    'discount'
);


ALTER TYPE public.loyalty_programs_rewardtype_enum OWNER TO postgres;

--
-- Name: loyalty_programs_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.loyalty_programs_status_enum AS ENUM (
    'active',
    'inactive',
    'paused'
);


ALTER TYPE public.loyalty_programs_status_enum OWNER TO postgres;

--
-- Name: loyalty_transactions_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.loyalty_transactions_status_enum AS ENUM (
    'pending',
    'completed',
    'cancelled',
    'expired'
);


ALTER TYPE public.loyalty_transactions_status_enum OWNER TO postgres;

--
-- Name: loyalty_transactions_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.loyalty_transactions_type_enum AS ENUM (
    'earn',
    'redeem',
    'expiry',
    'adjustment'
);


ALTER TYPE public.loyalty_transactions_type_enum OWNER TO postgres;

--
-- Name: payments_gateway_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_gateway_enum AS ENUM (
    'razorpay',
    'stripe',
    'cashfree',
    'manual'
);


ALTER TYPE public.payments_gateway_enum OWNER TO postgres;

--
-- Name: payments_invoice_method_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_invoice_method_enum AS ENUM (
    'cash',
    'bank_transfer',
    'cheque',
    'credit_card',
    'debit_card',
    'upi',
    'wallet',
    'other'
);


ALTER TYPE public.payments_invoice_method_enum OWNER TO postgres;

--
-- Name: payments_invoice_paymenttype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_invoice_paymenttype_enum AS ENUM (
    'income',
    'expense'
);


ALTER TYPE public.payments_invoice_paymenttype_enum OWNER TO postgres;

--
-- Name: payments_invoice_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_invoice_status_enum AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded'
);


ALTER TYPE public.payments_invoice_status_enum OWNER TO postgres;

--
-- Name: payments_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_status_enum AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded'
);


ALTER TYPE public.payments_status_enum OWNER TO postgres;

--
-- Name: plans_billing_interval_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.plans_billing_interval_enum AS ENUM (
    'month',
    'quarter',
    'year'
);


ALTER TYPE public.plans_billing_interval_enum OWNER TO postgres;

--
-- Name: products_stockstatus_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.products_stockstatus_enum AS ENUM (
    'in_stock',
    'low_stock',
    'out_of_stock',
    'discontinued'
);


ALTER TYPE public.products_stockstatus_enum OWNER TO postgres;

--
-- Name: products_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.products_type_enum AS ENUM (
    'goods',
    'service',
    'digital'
);


ALTER TYPE public.products_type_enum OWNER TO postgres;

--
-- Name: professional_user_professionaltype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.professional_user_professionaltype_enum AS ENUM (
    'ca',
    'accountant',
    'consultant',
    'other'
);


ALTER TYPE public.professional_user_professionaltype_enum OWNER TO postgres;

--
-- Name: professional_users_professionaltype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.professional_users_professionaltype_enum AS ENUM (
    'chartered_accountant',
    'advocate',
    'tax_consultant',
    'company_secretary'
);


ALTER TYPE public.professional_users_professionaltype_enum OWNER TO postgres;

--
-- Name: purchase_order_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.purchase_order_status_enum AS ENUM (
    'draft',
    'pending',
    'approved',
    'rejected',
    'completed',
    'cancelled'
);


ALTER TYPE public.purchase_order_status_enum OWNER TO postgres;

--
-- Name: purchase_orders_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.purchase_orders_status_enum AS ENUM (
    'draft',
    'pending',
    'approved',
    'ordered',
    'received',
    'cancelled',
    'paid'
);


ALTER TYPE public.purchase_orders_status_enum OWNER TO postgres;

--
-- Name: purchase_orders_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.purchase_orders_type_enum AS ENUM (
    'product',
    'service',
    'expense'
);


ALTER TYPE public.purchase_orders_type_enum OWNER TO postgres;

--
-- Name: reports_format_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reports_format_enum AS ENUM (
    'json',
    'excel',
    'pdf',
    'csv'
);


ALTER TYPE public.reports_format_enum OWNER TO postgres;

--
-- Name: reports_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reports_status_enum AS ENUM (
    'pending',
    'generating',
    'completed',
    'failed'
);


ALTER TYPE public.reports_status_enum OWNER TO postgres;

--
-- Name: reports_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reports_type_enum AS ENUM (
    'gstr1_outward_supplies',
    'gstr2b_purchase_reconciliation',
    'gstr3b_summary',
    'e_invoice_register',
    'e_way_bill_register',
    'hsn_summary',
    'gstr9_annual_return',
    'gstr9c_reconciliation',
    'rcm_report',
    'sales_register',
    'purchase_register',
    'tds_report',
    'profit_loss',
    'balance_sheet',
    'form26as_reconciliation',
    'depreciation_register',
    'audit_trail',
    'cash_bank_book',
    'ledger_report',
    'expense_category',
    'reconciliation_summary'
);


ALTER TYPE public.reports_type_enum OWNER TO postgres;

--
-- Name: subscription_changes_change_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscription_changes_change_type_enum AS ENUM (
    'upgrade',
    'downgrade',
    'switch'
);


ALTER TYPE public.subscription_changes_change_type_enum OWNER TO postgres;

--
-- Name: subscription_changes_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscription_changes_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected',
    'completed'
);


ALTER TYPE public.subscription_changes_status_enum OWNER TO postgres;

--
-- Name: subscription_payment_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscription_payment_status_enum AS ENUM (
    'active',
    'pending',
    'cancelled',
    'expired',
    'paused',
    'trialing'
);


ALTER TYPE public.subscription_payment_status_enum OWNER TO postgres;

--
-- Name: subscription_paymentgateway_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscription_paymentgateway_enum AS ENUM (
    'razorpay',
    'stripe',
    'paypal',
    'manual'
);


ALTER TYPE public.subscription_paymentgateway_enum OWNER TO postgres;

--
-- Name: subscription_plan_billingcycle_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscription_plan_billingcycle_enum AS ENUM (
    'monthly',
    'quarterly',
    'annually'
);


ALTER TYPE public.subscription_plan_billingcycle_enum OWNER TO postgres;

--
-- Name: subscription_plan_plantype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscription_plan_plantype_enum AS ENUM (
    'basic',
    'premium',
    'enterprise'
);


ALTER TYPE public.subscription_plan_plantype_enum OWNER TO postgres;

--
-- Name: subscription_plans_billingcycle_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscription_plans_billingcycle_enum AS ENUM (
    'monthly',
    'yearly'
);


ALTER TYPE public.subscription_plans_billingcycle_enum OWNER TO postgres;

--
-- Name: subscription_plans_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscription_plans_type_enum AS ENUM (
    'basic',
    'professional',
    'enterprise'
);


ALTER TYPE public.subscription_plans_type_enum OWNER TO postgres;

--
-- Name: subscription_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscription_status_enum AS ENUM (
    'active',
    'pending',
    'cancelled',
    'expired',
    'paused',
    'trialing'
);


ALTER TYPE public.subscription_status_enum OWNER TO postgres;

--
-- Name: subscriptions_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscriptions_status_enum AS ENUM (
    'active',
    'inactive',
    'pending',
    'expired',
    'cancelled',
    'trial'
);


ALTER TYPE public.subscriptions_status_enum OWNER TO postgres;

--
-- Name: tenant_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tenant_status_enum AS ENUM (
    'active',
    'suspended',
    'trial',
    'trial_expired'
);


ALTER TYPE public.tenant_status_enum OWNER TO postgres;

--
-- Name: tenant_subscription_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tenant_subscription_status_enum AS ENUM (
    'active',
    'pending',
    'expired',
    'cancelled',
    'trial'
);


ALTER TYPE public.tenant_subscription_status_enum OWNER TO postgres;

--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role_enum AS ENUM (
    'super_admin',
    'admin',
    'finance',
    'sales',
    'support',
    'member',
    'user',
    'professional'
);


ALTER TYPE public.user_role_enum OWNER TO postgres;

--
-- Name: user_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_status_enum AS ENUM (
    'active',
    'invited',
    'suspended'
);


ALTER TYPE public.user_status_enum OWNER TO postgres;

--
-- Name: vendors_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.vendors_type_enum AS ENUM (
    'supplier',
    'service_provider',
    'contractor'
);


ALTER TYPE public.vendors_type_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_log (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "tenantId" character varying,
    "performedById" uuid,
    action public.audit_log_action_enum NOT NULL,
    resource public.audit_log_resource_enum NOT NULL,
    "resourceId" character varying,
    details jsonb,
    "ipAddress" character varying,
    "userAgent" character varying,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_log OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "tenantId" uuid NOT NULL,
    name character varying NOT NULL,
    description text,
    "parentId" uuid,
    "isActive" boolean DEFAULT true NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    address text,
    "taxId" character varying(100),
    "tenantId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.client OWNER TO postgres;

--
-- Name: credit_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credit_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    credit_note_number character varying(255) NOT NULL,
    reason character varying(100) NOT NULL,
    status character varying(20) DEFAULT 'draft'::character varying,
    original_invoice_id uuid,
    amount numeric(19,4) NOT NULL,
    remaining_amount numeric(19,4) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying,
    issue_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT credit_notes_reason_check CHECK (((reason)::text = ANY (ARRAY[('refund'::character varying)::text, ('adjustment'::character varying)::text, ('write_off'::character varying)::text]))),
    CONSTRAINT credit_notes_status_check CHECK (((status)::text = ANY (ARRAY[('draft'::character varying)::text, ('applied'::character varying)::text, ('void'::character varying)::text])))
);


ALTER TABLE public.credit_notes OWNER TO postgres;

--
-- Name: credit_notes_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credit_notes_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    credit_note_id uuid NOT NULL,
    invoice_id uuid NOT NULL,
    applied_amount numeric(19,4) NOT NULL,
    applied_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    applied_by uuid
);


ALTER TABLE public.credit_notes_applications OWNER TO postgres;

--
-- Name: customer_loyalty; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_loyalty (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "tenantId" uuid NOT NULL,
    "customerId" uuid NOT NULL,
    "programId" uuid,
    "totalPoints" integer DEFAULT 0 NOT NULL,
    "availablePoints" integer DEFAULT 0 NOT NULL,
    "totalCashbackEarned" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "availableCashback" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "totalAmountSpent" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "totalOrders" integer DEFAULT 0 NOT NULL,
    "currentTier" public.customer_loyalty_currenttier_enum DEFAULT 'bronze'::public.customer_loyalty_currenttier_enum NOT NULL,
    "tierExpiryDate" timestamp without time zone,
    "tierBenefits" jsonb DEFAULT '{}'::jsonb NOT NULL,
    "lastActivityDate" timestamp without time zone,
    statistics jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE public.customer_loyalty OWNER TO postgres;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "tenantId" uuid NOT NULL,
    name character varying NOT NULL,
    type public.customers_type_enum DEFAULT 'business'::public.customers_type_enum NOT NULL,
    email character varying,
    phone character varying,
    "billingAddress" jsonb,
    "shippingAddress" jsonb,
    gstin character varying,
    pan character varying,
    "isActive" boolean DEFAULT true NOT NULL,
    "creditBalance" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description character varying NOT NULL,
    amount numeric(15,2) NOT NULL,
    category public.expenses_category_enum DEFAULT 'other'::public.expenses_category_enum NOT NULL,
    "paymentMethod" public.expenses_paymentmethod_enum DEFAULT 'cash'::public.expenses_paymentmethod_enum NOT NULL,
    "expenseDate" timestamp without time zone NOT NULL,
    "referenceNumber" character varying,
    vendor character varying,
    metadata json,
    "tenantId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- Name: gstins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gstins (
    id integer NOT NULL,
    gstin character varying(255) NOT NULL,
    legalname character varying(255) NOT NULL,
    tradename character varying(255) NOT NULL,
    address jsonb NOT NULL,
    statecode character varying(10) NOT NULL,
    isactive boolean DEFAULT true NOT NULL,
    isprimary boolean DEFAULT false NOT NULL,
    authstatus jsonb,
    "tenantId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.gstins OWNER TO postgres;

--
-- Name: gstins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gstins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gstins_id_seq OWNER TO postgres;

--
-- Name: gstins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gstins_id_seq OWNED BY public.gstins.id;


--
-- Name: hsn_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hsn_codes (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    description text NOT NULL,
    gstrate numeric(5,2) NOT NULL,
    cessrate numeric(5,2),
    isactive boolean DEFAULT true NOT NULL,
    tenantid uuid NOT NULL,
    createdat timestamp without time zone DEFAULT now() NOT NULL,
    updatedat timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.hsn_codes OWNER TO postgres;

--
-- Name: hsn_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hsn_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hsn_codes_id_seq OWNER TO postgres;

--
-- Name: hsn_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hsn_codes_id_seq OWNED BY public.hsn_codes.id;


--
-- Name: invoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "invoiceNumber" character varying(255) NOT NULL,
    "clientName" character varying(255) NOT NULL,
    amount numeric(10,2) NOT NULL,
    "dueDate" date NOT NULL,
    status character varying(50) DEFAULT 'draft'::character varying,
    items jsonb,
    "tenantId" uuid NOT NULL,
    "gstinId" integer,
    "customerId" uuid,
    "issueDate" timestamp without time zone,
    type public.invoice_type_enum DEFAULT 'tax_invoice'::public.invoice_type_enum NOT NULL,
    total numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    "eInvoice" jsonb,
    payment jsonb,
    "paymentHistory" jsonb,
    "subscriptionId" uuid,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.invoice OWNER TO postgres;

--
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_items (
    quantity numeric(10,2) NOT NULL,
    metadata jsonb,
    "unitPrice" numeric(15,2) NOT NULL,
    "taxRate" numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    "taxAmount" numeric(15,2) NOT NULL,
    "tenantId" uuid NOT NULL,
    "invoiceId" uuid NOT NULL,
    "productId" uuid,
    discount numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    "discountAmount" numeric(15,2) NOT NULL,
    "lineTotal" numeric(15,2) NOT NULL,
    "hsnId" integer,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    description character varying NOT NULL,
    unit character varying NOT NULL
);


ALTER TABLE public.invoice_items OWNER TO postgres;

--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "tenantId" uuid NOT NULL,
    "invoiceNumber" character varying NOT NULL,
    type public.invoices_type_enum DEFAULT 'standard'::public.invoices_type_enum NOT NULL,
    status public.invoices_status_enum DEFAULT 'draft'::public.invoices_status_enum NOT NULL,
    "customerId" uuid NOT NULL,
    "issueDate" date NOT NULL,
    "dueDate" date NOT NULL,
    "paidDate" date,
    "paymentTerms" public.invoices_paymentterms_enum DEFAULT 'net_15'::public.invoices_paymentterms_enum NOT NULL,
    "shippingAddress" text,
    "billingAddress" text,
    "termsAndConditions" text,
    notes text,
    "subTotal" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "taxTotal" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "discountTotal" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "totalAmount" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "amountPaid" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "balanceDue" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "discountDetails" jsonb,
    "isRecurring" boolean DEFAULT false NOT NULL,
    "recurringSettings" jsonb,
    "sentAt" timestamp without time zone,
    "viewedAt" timestamp without time zone,
    "deletedAt" timestamp without time zone,
    "gstinId" integer,
    "subscriptionId" uuid,
    metadata json
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: loyalty_programs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loyalty_programs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "tenantId" uuid NOT NULL,
    name character varying NOT NULL,
    description text,
    status public.loyalty_programs_status_enum DEFAULT 'active'::public.loyalty_programs_status_enum NOT NULL,
    "rewardType" public.loyalty_programs_rewardtype_enum DEFAULT 'cashback'::public.loyalty_programs_rewardtype_enum NOT NULL,
    "cashbackPercentage" numeric(5,2) DEFAULT '5'::numeric NOT NULL,
    "minimumPurchaseAmount" numeric(15,2) DEFAULT '10000'::numeric NOT NULL,
    "maximumCashbackAmount" numeric(15,2),
    "pointsPerUnit" integer,
    "pointValue" numeric(15,2),
    "eligibilityCriteria" jsonb DEFAULT '{}'::jsonb NOT NULL,
    "redemptionRules" jsonb DEFAULT '{}'::jsonb NOT NULL,
    "isDefault" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.loyalty_programs OWNER TO postgres;

--
-- Name: loyalty_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loyalty_transactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "tenantId" uuid NOT NULL,
    "customerId" uuid NOT NULL,
    "invoiceId" uuid,
    "programId" uuid,
    type public.loyalty_transactions_type_enum NOT NULL,
    status public.loyalty_transactions_status_enum DEFAULT 'pending'::public.loyalty_transactions_status_enum NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    "cashbackAmount" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "orderAmount" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    description text NOT NULL,
    "expiryDate" timestamp without time zone,
    metadata jsonb,
    "effectivePercentage" numeric(5,2)
);


ALTER TABLE public.loyalty_transactions OWNER TO postgres;

--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(255) NOT NULL,
    body text NOT NULL,
    data jsonb,
    "isRead" boolean DEFAULT false NOT NULL,
    type character varying(100),
    priority character varying(50) DEFAULT 'normal'::character varying NOT NULL,
    "userId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: payment_methods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_methods (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    type character varying(50) NOT NULL,
    is_default boolean DEFAULT false,
    details jsonb NOT NULL,
    fingerprint character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payment_methods_type_check CHECK (((type)::text = ANY (ARRAY[('card'::character varying)::text, ('bank_account'::character varying)::text, ('paypal'::character varying)::text])))
);


ALTER TABLE public.payment_methods OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "tenantId" uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    status public.payments_status_enum DEFAULT 'pending'::public.payments_status_enum NOT NULL,
    "subscriptionId" uuid,
    "gatewayResponse" jsonb,
    "refundedAt" timestamp without time zone,
    "userId" uuid NOT NULL,
    gateway public.payments_gateway_enum DEFAULT 'razorpay'::public.payments_gateway_enum NOT NULL,
    description character varying(255),
    "paidAt" timestamp without time zone,
    currency character varying(3) DEFAULT 'INR'::character varying NOT NULL,
    "gatewayPaymentId" character varying(100),
    "gatewayOrderId" character varying(100)
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_invoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments_invoice (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "tenantId" uuid NOT NULL,
    "invoiceId" uuid NOT NULL,
    "customerId" uuid NOT NULL,
    amount numeric(15,2) NOT NULL,
    method public.payments_invoice_method_enum DEFAULT 'bank_transfer'::public.payments_invoice_method_enum NOT NULL,
    status public.payments_invoice_status_enum DEFAULT 'pending'::public.payments_invoice_status_enum NOT NULL,
    "paymentDate" date NOT NULL,
    "referenceNumber" character varying,
    notes text,
    "paymentDetails" jsonb,
    "deletedAt" timestamp without time zone,
    "vendorId" uuid,
    "paymentType" public.payments_invoice_paymenttype_enum DEFAULT 'expense'::public.payments_invoice_paymenttype_enum NOT NULL
);


ALTER TABLE public.payments_invoice OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    category character varying(100) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: plan_features; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_features (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    plan_id uuid NOT NULL,
    code character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    value text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "planId" uuid
);


ALTER TABLE public.plan_features OWNER TO postgres;

--
-- Name: plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    price_currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    billing_interval public.plans_billing_interval_enum DEFAULT 'month'::public.plans_billing_interval_enum NOT NULL,
    trial_period_days integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.plans OWNER TO postgres;

--
-- Name: product_tax_rates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_tax_rates (
    tax_rate_id uuid NOT NULL,
    product_id uuid NOT NULL
);


ALTER TABLE public.product_tax_rates OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    description text,
    type public.products_type_enum DEFAULT 'goods'::public.products_type_enum NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "tenantId" uuid NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "hsnCode" character varying,
    "costPrice" numeric(15,2) NOT NULL,
    "sellingPrice" numeric(15,2) NOT NULL,
    "stockQuantity" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "lowStockThreshold" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "stockStatus" public.products_stockstatus_enum DEFAULT 'in_stock'::public.products_stockstatus_enum NOT NULL,
    unit character varying,
    "taxRate" numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    "categoryId" uuid,
    images jsonb,
    "isActive" boolean DEFAULT true NOT NULL,
    "deletedAt" timestamp without time zone,
    "hsnId" integer,
    name character varying NOT NULL,
    sku character varying
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: professional_tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professional_tenants (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "professionalId" uuid NOT NULL,
    "tenantId" uuid NOT NULL,
    "specificPermissions" jsonb,
    "isActive" boolean DEFAULT true NOT NULL,
    "assignedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.professional_tenants OWNER TO postgres;

--
-- Name: professional_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professional_user (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "userId" uuid NOT NULL,
    "professionalType" public.professional_user_professionaltype_enum NOT NULL,
    "firmName" character varying,
    "professionalLicenseNumber" character varying,
    phone character varying,
    address character varying,
    "isActive" boolean DEFAULT true NOT NULL,
    permissions jsonb
);


ALTER TABLE public.professional_user OWNER TO postgres;

--
-- Name: professional_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professional_users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "userId" character varying NOT NULL,
    "professionalType" public.professional_users_professionaltype_enum NOT NULL,
    "firmName" character varying,
    "professionalLicenseNumber" character varying,
    address text,
    phone character varying,
    "isActive" boolean DEFAULT true NOT NULL,
    permissions jsonb
);


ALTER TABLE public.professional_users OWNER TO postgres;

--
-- Name: purchase_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "tenantId" uuid NOT NULL,
    "purchaseOrderId" uuid NOT NULL,
    "productId" uuid,
    description character varying NOT NULL,
    quantity numeric(10,2) NOT NULL,
    unit character varying NOT NULL,
    "unitPrice" numeric(15,2) NOT NULL,
    discount numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    "discountAmount" numeric(15,2) NOT NULL,
    "taxRate" numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    "taxAmount" numeric(15,2) NOT NULL,
    "lineTotal" numeric(15,2) NOT NULL,
    "receivedQuantity" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "isReceived" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.purchase_items OWNER TO postgres;

--
-- Name: purchase_order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "tenantId" uuid NOT NULL,
    "vendorId" uuid NOT NULL,
    "poNumber" character varying NOT NULL,
    "orderDate" date NOT NULL,
    "expectedDeliveryDate" date,
    "deliveryAddress" text,
    notes text,
    subtotal numeric(10,2) NOT NULL,
    "taxAmount" numeric(10,2) NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    status public.purchase_order_status_enum DEFAULT 'draft'::public.purchase_order_status_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.purchase_order OWNER TO postgres;

--
-- Name: purchase_order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order_item (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "purchaseOrderId" uuid NOT NULL,
    "itemName" character varying NOT NULL,
    description text,
    quantity numeric(10,2) NOT NULL,
    unit character varying NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    "taxRate" numeric(5,2) NOT NULL,
    amount numeric(10,2) NOT NULL
);


ALTER TABLE public.purchase_order_item OWNER TO postgres;

--
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "tenantId" uuid NOT NULL,
    "poNumber" character varying NOT NULL,
    status public.purchase_orders_status_enum DEFAULT 'draft'::public.purchase_orders_status_enum NOT NULL,
    type public.purchase_orders_type_enum DEFAULT 'product'::public.purchase_orders_type_enum NOT NULL,
    "vendorId" uuid NOT NULL,
    "orderDate" date NOT NULL,
    "expectedDeliveryDate" date,
    "actualDeliveryDate" date,
    "shippingAddress" text,
    "billingAddress" text,
    "termsAndConditions" text,
    notes text,
    "subTotal" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "taxTotal" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "discountTotal" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "totalAmount" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "amountPaid" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "balanceDue" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "taxDetails" jsonb,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.purchase_orders OWNER TO postgres;

--
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "tenantId" uuid NOT NULL,
    name character varying NOT NULL,
    type public.reports_type_enum NOT NULL,
    format public.reports_format_enum NOT NULL,
    status public.reports_status_enum DEFAULT 'pending'::public.reports_status_enum NOT NULL,
    parameters jsonb,
    filters jsonb,
    "filePath" character varying,
    "recordCount" integer,
    "generatedAt" timestamp without time zone,
    "errorMessage" text
);


ALTER TABLE public.reports OWNER TO postgres;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_system_role boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "tenantId" uuid NOT NULL,
    "companyName" character varying,
    subdomain character varying,
    "contactEmail" character varying,
    "contactPhone" character varying,
    address character varying,
    "gstNumber" character varying
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- Name: subscription_changes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription_changes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    subscription_id uuid NOT NULL,
    requested_plan_id uuid NOT NULL,
    scheduled_at timestamp with time zone,
    effective_date timestamp with time zone,
    prorated_amount numeric(19,4),
    notes text,
    requested_by uuid NOT NULL,
    reviewed_at timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    reviewed_by_user_id character varying,
    "reviewedById" uuid,
    change_type public.subscription_changes_change_type_enum DEFAULT 'switch'::public.subscription_changes_change_type_enum NOT NULL,
    status public.subscription_changes_status_enum DEFAULT 'pending'::public.subscription_changes_status_enum NOT NULL
);


ALTER TABLE public.subscription_changes OWNER TO postgres;

--
-- Name: subscription_plan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription_plan (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "planType" public.subscription_plan_plantype_enum NOT NULL,
    name character varying NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    "billingCycle" public.subscription_plan_billingcycle_enum DEFAULT 'monthly'::public.subscription_plan_billingcycle_enum NOT NULL,
    features jsonb DEFAULT '{}'::jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.subscription_plan OWNER TO postgres;

--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription_plans (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    price numeric(10,2) NOT NULL,
    features jsonb,
    "isActive" boolean DEFAULT true NOT NULL,
    description text,
    "trialDays" integer DEFAULT 0 NOT NULL,
    "tenantId" uuid NOT NULL,
    type public.subscription_plans_type_enum DEFAULT 'basic'::public.subscription_plans_type_enum NOT NULL,
    "billingCycle" public.subscription_plans_billingcycle_enum DEFAULT 'yearly'::public.subscription_plans_billingcycle_enum NOT NULL,
    "maxTenants" integer DEFAULT 1 NOT NULL,
    "maxBusinesses" integer DEFAULT 1 NOT NULL,
    "maxUsers" integer DEFAULT 5 NOT NULL,
    "validityDays" integer DEFAULT 365 NOT NULL,
    name character varying(100) NOT NULL,
    currency character varying(3) DEFAULT 'INR'::character varying NOT NULL
);


ALTER TABLE public.subscription_plans OWNER TO postgres;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "tenantId" uuid NOT NULL,
    "planId" uuid NOT NULL,
    status public.subscriptions_status_enum DEFAULT 'pending'::public.subscriptions_status_enum NOT NULL,
    "startDate" timestamp without time zone NOT NULL,
    "endDate" timestamp without time zone NOT NULL,
    "cancelledAt" timestamp without time zone,
    metadata jsonb,
    "autoRenew" boolean DEFAULT false NOT NULL,
    "userId" uuid NOT NULL,
    "stripeSubscriptionId" character varying(100),
    "razorpaySubscriptionId" character varying(100)
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: super_admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.super_admin (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    password_hash character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    permissions jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE public.super_admin OWNER TO postgres;

--
-- Name: super_admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.super_admins (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    password_hash text NOT NULL,
    is_active boolean DEFAULT true,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.super_admins OWNER TO postgres;

--
-- Name: syncLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."syncLog" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    results jsonb NOT NULL,
    "tenantId" uuid,
    "userId" uuid,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."syncLog" OWNER TO postgres;

--
-- Name: tax_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_details (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "taxName" character varying NOT NULL,
    "taxRate" numeric(6,2) NOT NULL,
    "taxAmount" numeric(15,2) NOT NULL,
    "taxableValue" numeric(15,2) NOT NULL,
    "invoiceId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tax_details OWNER TO postgres;

--
-- Name: tax_rate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_rate (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    rate numeric(5,2) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    description character varying,
    "tenantId" uuid NOT NULL,
    "productId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tax_rate OWNER TO postgres;

--
-- Name: tenant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenant (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    subdomain character varying(255) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "businessName" character varying(255),
    status public.tenant_status_enum DEFAULT 'trial'::public.tenant_status_enum NOT NULL,
    "trialEndsAt" timestamp without time zone,
    "stripeCustomerId" character varying,
    slug character varying(255),
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tenant OWNER TO postgres;

--
-- Name: tenant_subscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenant_subscription (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "tenantId" uuid NOT NULL,
    "planId" uuid NOT NULL,
    status public.tenant_subscription_status_enum DEFAULT 'pending'::public.tenant_subscription_status_enum NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date NOT NULL,
    "trialEndDate" date,
    amount numeric(10,2) NOT NULL,
    "isPaidByProfessional" boolean DEFAULT false NOT NULL,
    "paidByProfessionalId" uuid,
    "stripeSubscriptionId" character varying,
    "stripeCustomerId" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tenant_subscription OWNER TO postgres;

--
-- Name: usage_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usage_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    subscription_id uuid NOT NULL,
    metric_code character varying(100) NOT NULL,
    quantity numeric(19,4) NOT NULL,
    recorded_at timestamp with time zone NOT NULL,
    recorded_by uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usage_records OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    "pushToken" text,
    "biometricEnabled" boolean DEFAULT false NOT NULL,
    "tenantId" uuid NOT NULL,
    status public.user_status_enum DEFAULT 'active'::public.user_status_enum NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "lastLoginAt" timestamp without time zone,
    role public.user_role_enum DEFAULT 'user'::public.user_role_enum NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: vendors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendors (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "tenantId" uuid NOT NULL,
    name character varying NOT NULL,
    email character varying,
    phone character varying,
    gstin character varying,
    pan character varying,
    "isActive" boolean DEFAULT true NOT NULL,
    type public.vendors_type_enum DEFAULT 'supplier'::public.vendors_type_enum NOT NULL,
    "billingAddress" jsonb,
    "shippingAddress" jsonb,
    "outstandingBalance" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "paymentTerms" text,
    "deletedAt" timestamp without time zone,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.vendors OWNER TO postgres;

--
-- Name: gstins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gstins ALTER COLUMN id SET DEFAULT nextval('public.gstins_id_seq'::regclass);


--
-- Name: hsn_codes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hsn_codes ALTER COLUMN id SET DEFAULT nextval('public.hsn_codes_id_seq'::regclass);


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_log (id, "tenantId", "performedById", action, resource, "resourceId", details, "ipAddress", "userAgent", "timestamp") FROM stdin;
ca286913-5e85-49b8-8058-0ba3317c242d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:02:30.304116
5a2bf00b-8715-4b9e-8493-175e71439c45	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:02:30.357448
a764c9f6-f328-4b09-aab9-9430d395cd6f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:19:11.056622
9f76e365-74c9-4b43-8708-8326a6b05c68	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:19:11.118705
98b95a8f-ca75-41f1-bb8c-473afd33fa9f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:21:46.336507
3b1579e3-408f-4fb0-9a70-3034f9af8023	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:21:46.369818
bce1c26f-7eef-4e33-92ef-d23f6f7f0496	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:21:48.066478
51ab79c0-ee71-4d89-9955-01bdb87f4268	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:21:48.088588
1d5471e3-f03b-4a4d-aacc-37e35099d43e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:21:51.186989
5fd83dd6-1e27-45d3-b944-8827b7ecd03d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:21:51.207095
1a2bfb6e-8241-47ea-92dd-0e6dfcf4ed04	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:23:15.068657
b4729f55-afd7-4409-918b-47db89ee1a5c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:23:15.112812
ab83efed-3533-4bfc-883a-98b6f9476ea0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:24:44.296853
0b1ac299-0084-4365-b901-7ce312fd88d1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:24:44.322134
6ba3fa13-016a-4a5c-a177-164cfa1226ce	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:24:48.92247
ff212471-8687-4353-9f38-b287da4042f6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:24:48.942425
d94d1ec9-ab3c-4377-8a28-e6d8d2a35ee5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:25:01.842692
ba024fa8-a42c-49e5-9239-01024390c341	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:25:01.862838
ceaea1af-cdde-48c9-ad80-7373b0d2a759	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:25:10.256486
3246ea12-fa58-4065-86f9-d28cc62f8182	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:25:10.277126
51c3caf4-241d-471c-ae39-61d960620435	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:25:11.638412
a3b559da-0bfc-4b82-826b-b57f20f3bc4d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:25:11.657549
c9daa1f0-89c6-4b24-9655-6103d15b7968	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:25:25.45935
a1e0af88-e6a1-41ef-afd9-c95f71af355d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:25:25.480479
fc47cb42-7d1a-4bb7-b266-f5f5e1f4100e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:26:36.293975
f1ebb271-1c06-4a2d-ae52-4015a0c43b20	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:26:36.31553
c5615361-e5d2-44f0-a02c-29c5b5446eb9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:26:37.417923
1a91e966-9bec-4ed0-a63b-23e5b4685cec	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:26:37.44141
e11a50b3-608c-47ee-b130-ec4016d21668	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:26:59.933735
f28f969b-4da2-4dba-827a-073d12a80b54	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:26:59.951272
ed80eaeb-3817-495b-bfff-f5ebd30a3c68	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:27:01.056013
d1146539-d950-40e1-b8bf-63d08a80b204	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:27:01.074612
4cd851e8-c5cb-4ea1-b1a9-dd523aa2643a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:27:04.642892
45745064-69eb-406c-ac6f-a28c4d819b8b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:27:04.661503
a442ca12-597a-4ab8-abe5-b179b6e36fb1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:28:57.102243
1f3d3b6a-fe85-4758-a581-810b4e3324fd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:28:57.125664
d596c08e-c41d-491e-ba75-90276856346f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:29:00.73272
39c77f2b-5744-4e4e-9f09-ca93aa00ae82	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:29:00.750524
8726a9fc-810c-4176-aeac-3e224da54c6c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:29:01.927068
3774a378-5835-4e20-9071-280cf9715fa6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:29:01.946111
9c3bd59b-9c93-4fb9-95a0-e208ca5dfcea	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:29:02.641336
12ab9915-0383-4f92-b73f-1ff5d124caf5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:29:02.65906
e87a2a14-4d1a-4aa2-94d5-7235aeab8c2e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:33:50.980874
bb2d1eb4-0462-40d8-a4d1-2e97f3949c11	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:33:51.02413
0770f1e7-8f30-4ef1-bf2a-4e226e4a39f9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:34:00.399252
54bb5534-fa34-4ec9-a6c3-3b87ae9bbeac	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:34:00.416877
316bb8ef-2595-4d34-9d00-8f163c545f54	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:34:02.089889
adc01428-4a61-4047-9502-6e2aaf20507c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:34:02.118207
01382289-8bf1-4962-b8cc-225269982afa	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:34:05.753712
5d48ce18-3857-418a-8349-4fab47b5c0e4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:34:05.786355
79c375b8-a6ad-4cdb-91c3-2d34b2ec89ec	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:50:03.208822
7614321d-ab4f-4cca-8872-6340813e6c5d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:50:03.264133
280d62c9-a98b-46c1-b837-52f13c7cce95	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:50:10.859757
7dfcc046-5849-4aef-a593-630ad4561d22	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:50:10.882853
f7c5a0a6-b866-41f8-a96e-f50a70773e65	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:50:12.281771
9d7539eb-a002-4557-aa1a-c2bb7a74e703	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:50:12.323721
2fb607f1-0e81-482e-955f-c563546f4a42	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:50:26.486984
248f9617-1de8-4145-a31a-3c1a0f876a94	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 12:50:26.539923
dcc4aba1-21a0-4fd3-902c-1d4fdb561fa2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:43:24.101371
7bb827e0-c347-4af5-9baf-e4fcf16218a1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:43:24.142884
6cb3a7bf-a14d-4cc2-a312-2d1f9447246c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:43:30.558815
fa0660d2-ad2a-4a77-9114-81a58b7b055f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:43:30.590836
ea11183d-ba95-475b-9698-63aeb59180be	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:43:51.234604
9da1a62b-d03d-4956-aa42-356af881b3aa	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:43:51.265183
5d986c91-8283-4fb9-92bf-8b4e8c1a9bdd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:43:59.556453
7a3f9edc-c2b0-45ef-87cb-c4a66c54dfae	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:43:59.596311
8b6292bb-af47-4627-abc1-c6afd4268b3f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:45:15.284887
4b8e6df0-e141-46e5-aaca-d6ba13952b24	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:45:15.322989
8b8b945a-261e-41c1-8687-7212a206b827	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:45:33.778149
c2f649f0-c8b4-435c-a164-172d2316d7f4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:45:33.804682
f9dd68bf-a40d-4067-b300-ce379e3434ab	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:45:35.587573
ffac93d1-e22b-44a5-a453-da8fbdb35590	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:49.338526
fb3a5bdc-6716-4fbd-ae9a-fe9cb5fd90a1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:45:35.605691
fab8b1c1-f222-4a4a-b58b-15618b4019ff	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:45:36.332833
ad49fa7c-a7eb-4aa7-931f-ab27675688ca	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:45:36.351049
4dd6e89f-283c-46d3-9efc-709bbcae3ad8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:57:26.702953
2e0c2fbe-42a6-40e0-bee5-ebdeeccc6917	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:57:26.749936
6080f229-a825-40ec-8d45-835297f856bb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:57:47.921883
ed5b7ac9-e55a-4068-b6ea-0ba06ec2d4c5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 14:57:47.944047
3db2b63f-9190-4de7-9b53-88e2255abbb8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 15:02:21.383402
381283d8-b9b3-4be3-89f7-c80048385ecf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 15:02:21.443999
ef774683-3671-4688-8a6e-cac917a2e6e5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 15:06:49.479157
ca25b2f2-b906-41fe-8548-cfddf1b2c886	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 15:06:49.51839
41bb17ed-96f3-4051-b48e-919e46d41517	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 15:06:50.394834
84eeb869-9942-489c-a7c3-c30217839f65	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 15:06:50.412028
aa9efd61-0946-43a1-8d6c-2989ef7fd71c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 15:06:53.809315
027f8945-63c3-42b0-9b79-ebeaac8f3faf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 15:06:53.842342
c31eb1c7-27e0-4ee8-ac3c-f4bcf37c44af	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 15:06:55.711647
c13f3bf2-3e6e-43a7-be85-a218e7df2be4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 15:06:55.728817
64157e51-4d96-4f35-a2f3-7812eeada6f8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:12:44.164131
3ccf80cf-d382-4694-9679-1ea8ab9c3604	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:12:44.223905
977f4fd9-438f-471a-861b-e85af1ed1638	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:12:51.089825
46b39de7-ec56-44db-a2a3-8f7d365fa129	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:12:51.118692
68272191-7f34-4e6c-b130-80c6458dfbba	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:13:12.631547
8fd6484b-3dcb-488a-a89c-3d53d98b8c01	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:13:12.702133
b8cf033d-f914-49f4-9377-74b19a0509db	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:13:15.764647
2e6cf209-976b-4818-a54a-3d6cbacd99ba	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:24.340826
d64e6cb1-b11e-4119-b718-bde6f85fe733	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:13:15.790291
662955e5-a9ee-4739-9589-0b9bd6936401	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:14:35.431525
a70ceda5-5770-42f6-ac50-faf7e000a8e6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:14:35.49195
5fdfcaeb-743d-4e7f-866b-8c0e5a439f03	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:14:37.604671
b6f7c352-393c-4cc0-b86b-cea6e5529d39	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:14:37.698959
328d76e0-1608-4836-a3d3-94061e6858e1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:16:00.274647
b37ce417-6e89-49fb-99d0-b90e52d0018d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:16:00.304436
0583ae72-f546-49c9-9605-96ec252042c6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:16:03.39786
89774199-2235-4cb7-9a91-82578bb0068a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:16:03.453622
0dec54e3-dc4f-4be7-a6e4-0e2df6f79cf9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:17:19.888666
d6e09048-a824-4b4a-8f3c-e3c5f8198d3c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:17:19.951472
f5439229-a3f3-4707-b7b3-f425ad5bf3ce	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:17:24.777368
8bcb35c7-081b-4a9d-b636-8012f943a714	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:17:24.932845
2e7f21c9-4194-40f6-8623-f70844e87a2a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:18:52.484259
2c75c456-6021-4b8d-8215-db61360699ac	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:18:52.529383
3ae29c97-11c8-4532-9e40-51b00d155e94	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:18:57.184165
fb6044aa-8e9e-4f0e-a1f1-90f4f0b20203	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:18:57.268763
4e06ddef-6a4f-4eea-a516-b35e0da449d6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:19:52.11189
a07e83c5-e86a-4dbc-bfcb-dd0394fcd1e8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:19:52.159776
cbe43e9a-60c4-4e03-89cc-ad4e488540f0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:19:57.989237
00006dc5-0c6a-46ea-8b9f-337d84ef9949	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:19:58.720263
ebea3050-4788-4a0a-ba6e-4e2155d779e8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:19:58.834434
52109510-7fa8-41b9-9d24-23c7a27bcd88	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:19:58.883803
83971b89-3b71-46cf-95a8-c8b4750edefd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:19:59.823121
2b64ac12-21a3-4185-b716-54ddd2ba8fc5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:19:59.869108
0a2558ae-fe93-48b8-80d2-cd603dfe9fb9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:28:18.201772
e7d14f6c-d79f-425e-b476-3c53d5f57907	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:28:18.252107
4c922e32-5785-4aec-a6df-ed5f7892cb29	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:28:23.981523
78db2bf2-3869-4f2a-9843-86bffceba705	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:28:24.648256
e6c9d610-973f-47f5-9135-719f644e0b7b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:28:24.741439
72c75bab-ff10-4ebe-b4d7-8ca6ae38aaf4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:28:24.783943
ca2ebce1-5916-44a8-901e-bf24da60b636	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:28:25.30465
fa016512-ef34-4646-bb70-dce3d47895cb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:28:25.349431
7961330c-febe-4ec8-ae3f-788bb2b03b64	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:30:49.850176
c4660a89-af94-4c2e-a197-253bc89e4de3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:30:49.968922
f144b6b4-41bb-426e-8ebe-93c08de90552	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:30:50.112616
379b6967-9708-4dc3-81b6-c6327e5c51ed	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:31:14.201571
6285d27f-740a-4bb4-b0e9-b35e7acdf498	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:31:14.287793
825b33d0-2cde-49e6-ac83-e8813f93ace2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:31:21.481727
64515fb6-4d38-4468-bf07-b88d49ebd7f2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:31:22.202316
e3f24e90-80fb-4a73-82c4-8394c6517c0f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:31:22.300991
3a0f0876-9b35-4cf9-89b4-ff4fc5043f16	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:31:22.343026
aa179060-7a6d-432c-aa18-9f0e016a62a0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:31:22.83865
e9380153-a7c0-44d7-aa22-1eb9be75e15e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:31:22.874209
1eeab1bf-76a6-42a4-87da-dd153c314e2e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:34:03.872299
8c6c8a7c-d0c8-426c-9161-bffb05ea17a1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:34:03.986759
2385642d-d2de-4e35-8a23-7ffa30ecf43d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:34:04.047298
2aa94f45-6bb3-4885-8c31-be6ebe67ac97	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:34:29.467368
c3c5e5d6-3f59-4baa-ba18-25ff35d6c20a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:34:29.538411
7a38f533-0a89-4c53-a304-56713e906881	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:34:48.489621
4dff1eaf-7269-4721-8294-e49847707479	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:34:48.543998
8f4d2392-36c8-45f0-81a1-a4ef7bf9a839	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:34:50.744726
e51ad706-1a49-45f3-8585-a3bfdd5f8bb8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:34:51.49269
f315b10d-ecab-4a7c-b53c-93375fff2e79	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:34:51.5695
293d6587-4ef1-4325-afb8-5f14d2b439b3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:34:51.618154
6844f0c4-6695-49a9-a31d-9d7f7c6a67e9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:34:52.085868
0558fea4-e380-4867-9e49-615b14af4595	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:34:52.12516
dc2303b9-5788-42f1-be08-5e992578104b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:36:00.044048
7582f937-6c46-4a7c-8435-5310b5a33f4b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:36:00.174468
460b6d57-e9dc-4879-9e7e-b3d2fa29fd95	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:36:00.318158
c3fd7c6e-7d13-417a-9c47-d31d5fd9fab2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:36:25.470113
5bc939fe-8cf8-4269-bd11-39f128fed0dc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:36:25.512595
c4476088-e3d2-4965-a9ed-42d0ca126680	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:36:32.043316
d55a3bcc-605d-448f-ba6d-1ac368327809	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:36:32.809316
d1a50468-6943-4364-9052-6148e07077d7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:36:32.887617
292c58a5-563f-470d-bd10-ae2267f88de8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:36:32.934072
d17e636a-c385-4609-8521-4790a4519474	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:36:33.519826
32e7f4b1-84c4-4cfe-9c86-8f12e1a4162c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:36:33.555601
38c9e72c-4603-4f57-8d61-c0bb67a3523b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:36:46.207873
6ef32927-e675-4df2-b2f2-d9333d7c7687	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:36:46.253625
fad02fa9-ecbb-470c-b89d-df89f37fcf62	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:38:55.092382
f46edb71-b3ff-418d-8403-003d5ef702cf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:38:55.13378
da29224f-9054-4947-bbf9-c5eb7810da6e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:39:01.03414
e18051b5-c300-4d08-a6dd-65d951c4f45d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:39:01.869752
5de1e479-d270-4d72-9969-f083b1baddc5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:39:02.066701
67cbac2d-77e9-4376-ae70-8f14117328d5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:39:02.108411
2253e87b-1646-4f22-a003-2b46a850acc9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:39:02.513506
d1e1678e-c24d-4ac8-b16d-6390f09f5734	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:39:02.554235
cc29d16a-3f88-457c-b167-438edba8ec2d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:41:38.530398
e44232ba-044a-42f2-b488-13b11cdd072f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:41:38.647811
85ef385f-acce-4634-9209-4fc6b9309ec7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:41:38.704433
774adc37-0d88-4e83-b21d-cc041a097165	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:42:03.472251
e3782a7d-aeea-4a78-8074-aa78e5d28d5a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:42:03.566432
df549ad2-5ec3-4776-8d54-26dcf758ff3d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:42:12.94124
ff78f3f1-00ce-4ce2-b3cd-6b1d2866cde3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:42:13.537997
97a8d685-8b4b-45b9-a686-6ab5f96a491a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:42:13.642867
85591279-93ea-4689-a9da-5998c5b03e60	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:42:13.689697
af191bbe-69d2-4aca-a266-a1bd16145cdc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:42:14.331996
865bf4e6-88c2-4a9b-a41c-65fe64e037ed	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:42:14.371854
d30873e6-d095-410e-9727-cb54da190af5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:43:05.358934
f68531bb-5128-4b5b-9f44-b2fd5431d2c8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:43:05.466969
03030856-35c2-46be-99d1-6156069aec97	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:43:05.514442
797703c7-c240-4851-8c5c-81fc545e8175	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:43:30.236863
7418fe04-ad4a-4cc8-931d-ee45c1fb7695	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:43:30.304085
5838ac93-ac0a-4477-a322-b66c4a8432e8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:43:34.621055
96dc4562-eef2-4ded-b00b-f7ac501915ec	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:43:35.288308
ce7fc385-81c9-4889-87ff-a8b4a2305a22	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:43:35.394734
91957e18-66bb-45d3-984f-7beaf7fbe6b2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:43:35.437781
612e611f-b819-4ba1-bea8-3aa630fe871e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:43:36.092281
0697dd14-4829-4ec1-88fb-5378fab9ee01	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:43:36.13306
5ba95277-e2ac-4c6f-b8b7-c56ff6e0405e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:47:58.703644
5c444b81-72f8-4380-abc4-936bad0c123a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:47:58.815681
ce95cf56-a4d2-4e45-8370-22c0929a1141	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:47:58.874299
8f2fc930-6c62-4a92-bf6b-0fe217c6f328	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:49:12.398936
af6a5db3-19c0-4697-b10b-1d5e0c795a65	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:49:12.644488
af11d38b-abda-4c38-b985-0dbe2680e744	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:49:57.187625
a0f2203a-2bf8-44f8-ae93-166f7b7e681e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:49:57.227464
2c5155d4-21f7-4762-86a6-1cbda832a873	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:50:01.442519
83504fd2-a78c-4ddb-9b03-dc97e7b05bdf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:50:02.062986
211a6081-d6d2-4be2-8de6-43539d7b633f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:50:02.144072
0539198c-ff50-4f20-882f-936033512556	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:50:02.193357
f8e76e11-793a-4ab5-8119-68c7c63ac657	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:50:02.696245
a7c742e5-bb91-43f7-9ebe-16bd73c6fbc6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:50:02.734615
8dc10d9d-064b-455a-981d-0d7b75f0370b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:51:04.877804
620daa05-27e1-495a-b224-53c79cf5287b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:51:04.937307
e5c2ddfd-3338-49a3-a66b-79a19fe8aa04	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:51:07.815263
a76a44a7-db24-459d-8223-a0177f1ed191	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:51:07.915373
67be7918-5483-4465-b3d0-34187bfe1269	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:51:08.000197
41221e8a-7496-43f8-abe6-49036f51377e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:51:08.056675
bb1b5985-4235-4e41-82ef-4e5254f0be40	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:51:08.101928
ceb5efd7-3996-49bc-9b6c-c789735d328e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:51:08.143973
f1d4909e-2ed3-499b-98ae-c0ee02bfe2d6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:52:33.472043
56f2727b-658b-4e34-948b-72ec2b81c0ce	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:52:33.577156
c361b693-2c0a-476e-bd17-d954f8a60a4e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:52:33.622968
6bd1e099-a79b-4fb6-ae87-b56e33761557	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:03.736065
c7219ff7-c98a-415b-b33a-ef33473088be	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:03.834978
ca00bb9a-868f-4441-9727-387d0e4724fc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:03.920389
ea4cf896-df68-4c4c-bc1d-33b7e4104b0e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.008301
7edf659e-7ddc-40d0-a242-a900aa9c4951	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.065376
26127c7f-798d-49a9-b626-95aef6ca56b7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.104698
49c9dced-8c2c-48b6-bfe2-2116958e08c8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.154319
c327110c-d3db-42c1-9a9f-b89155044a74	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.203904
cbca6a64-634c-40fb-a095-29bc916fbc5e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.280649
01eab412-b2dd-479b-b41c-942577aa466c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.323589
5a07edd8-d5de-4322-be60-0dc1376c6184	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.395557
6a156cc8-2cfd-489a-92d8-7cae22b59a61	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.437985
723eae73-1388-44b5-8cb9-8b9dd44d1d14	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.565969
f63c9d8b-54a9-4730-809a-9a91556bece3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.765355
a4fca0e4-5beb-434b-8d2e-3deb187e454d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.830737
475376e4-9863-40bc-878c-b9fad554908e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.880559
a908982f-648c-41ec-9e4c-c3c8e5f4eff2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.017404
09992027-7c2e-47bd-b096-f967bbc3e719	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.080455
37889d20-6d03-4148-a724-f4e88c735eec	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.121877
dc0e5ba8-7a54-4ebe-9258-1c7d66227622	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.194748
cb86cfcb-32f1-4ec8-b93c-40bab1f69e01	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.235727
c96c4a87-0e2f-42f9-b6c2-4bb618af6d4a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.30254
00babd21-6f37-4f8f-ace2-73d04f45a0f0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.366135
3a7f6705-b220-48d9-aef9-4f53d367bd46	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.404926
dacadbed-045d-4360-8ea4-cefb6add7724	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.474557
e9f42976-53cd-4fa0-86c3-6dfdbde90a52	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.514483
e8c8f28c-8543-45b1-b76c-3aae50cb5c71	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.244699
9d504c1e-9910-4f55-8dd3-a5ed92d115e5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.363493
4f8c9dda-7ab6-4fe2-9036-319f2646e94b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.456749
4f4f04b8-df78-4b3e-8a0c-6b9d5912ba2f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.490675
2011cf0a-ad98-4716-93bf-414a542a1a92	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.658544
b00a386f-7a86-435d-bb7b-a365a8d7f9e3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:04.943139
c3c9f359-03ff-4ec6-a7cc-03f66f00a653	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.161118
1e3af880-a801-40ed-b012-a875d8c720fb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.261583
1630398b-6178-4fc1-b773-733c470704a0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.344677
112e3b27-a470-43ba-bce0-ccc2237810ef	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.441525
3387e1d6-e26e-4268-a853-98aa494370e8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.55327
70d9fda5-763e-4fa5-bd25-f5f9636eefee	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.766054
f96f8ed7-b0f0-40d3-896f-8a68f7eeae24	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.8665
0e251016-17de-4a76-9a9c-0218d1acb7f4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.945864
33f3c8ec-9515-455c-aac1-9b2d0314b139	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.075279
34cb409c-23d2-4013-a01d-b29537e73674	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.212237
5afcf6c8-fa77-40ca-bff1-f34da0cb53fa	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.401906
ade945c0-0687-44b5-9c26-3cf2a0c8e3a8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.537391
444ddd43-ce99-4a91-b65c-0f56830707e9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.597256
a5b46757-fdf5-4bd7-b138-c05da0a4995b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.650708
0afc5ccf-e5db-40be-8f5e-2c4dde8e4ad4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.684023
aa743457-831e-4bfb-b69e-109ada80f085	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.731971
66ba97ca-4b75-45f4-99cd-6b53f85942bf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.805427
a932d3c6-02b2-410b-bb31-072304c49644	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.847773
7fa63148-5f69-4368-b0e9-8987858261c7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.909669
ee6f1a8a-d47b-4cf8-937a-88d04c5df14b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:05.982352
33ee762a-f15b-4d8b-bbbc-730b1fd06cea	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.030884
ebe5dae3-25b0-44c5-8b6d-ae8215df7d89	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.113878
d1517fd0-de9f-4901-b45e-09414d293d9a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.166952
800499c8-33bb-46ea-ae2c-04657eb6de84	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.256059
e1ed7bc9-1621-4580-a3bd-8d84d3920da2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.303536
36585851-046e-408d-8552-22107508c594	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.36506
257bab53-22f7-4da3-84df-2ad2190bd0bf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.449769
64b0f29c-1d0f-4003-996c-99ed0ee881e5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.507623
89a94fb2-05af-419c-b83d-8a302bfc9ea3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.700705
08bf25df-2ea7-4787-a2f1-da5701f0dab4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.907625
864a2eb0-1fa3-4fac-87e2-4c3af4b0d8d9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.954516
8b37103c-8a6a-402f-904c-d010ec032b99	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.039449
8e5e15c2-9295-4f5f-9e6d-0487d4367c16	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.132734
be8b672b-c686-44ac-8641-1a2d47dab272	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.211778
9d871c4d-a6bb-4b1a-a39d-c9030049e2f4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.7474
a1b3b551-1c06-41d1-87b1-04e254154060	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.8455
c57c4d5d-0434-4499-bc1e-0e6d862671a6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:06.996797
e3ab7272-6ef5-47b5-aa96-675faca826f6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.085558
7b325150-4ad6-45bd-b447-4849f50b3189	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.260472
c2a9456f-303f-4c44-960e-e0d692103efc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.350836
444ba16d-2b94-4dea-aa87-02ff95c004bc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.478857
363417b0-393b-45f5-b086-0c001905014b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.577564
dd747e50-92f3-4647-b497-874c3ee7f5af	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.715421
132373e7-9347-4df5-a2ee-05f3f515df6b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.823667
eb7c8d3e-c87b-428c-932a-d44fd40311a6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.872757
601b35b1-eef8-4b57-b6db-4b4858e000c8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.942268
6f0772bf-090a-449c-abea-13c49b3112d3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.987789
3b3c86d8-f16c-4f9a-aff0-4e57c0bd57dc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.096173
873290af-4eec-4982-9bf8-cda73a124f8f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.176705
68ff0dc9-6ab3-4ed9-8e34-f6086377d294	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.364162
1727ed41-bd65-471d-a789-910c22570749	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.452793
01c064c0-ff16-46ed-b00d-e68b1afeb674	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.532504
4e6021ee-8209-4183-bc30-170397f2a914	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.615216
2e3dea68-ae06-41bc-9e01-589c3da603e5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.814163
23b98831-6e6b-4464-b302-54ea9951f6d6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.301566
686557ac-a9df-4c45-9c4d-d17b25c76076	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.383916
29facdb3-c30c-40b4-b68c-1578503ebf87	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.433592
a93d288d-015d-47c7-a24e-7f34dd6d6feb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.518896
7c6349a9-f33a-4857-9d6c-83560a1a207c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.60209
9bb07e88-12ea-4b57-be3c-a980612fcc7b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.645375
bcbb4612-b1bb-43b1-af56-cfe575129a6f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.752582
67272145-9023-44a8-9493-2abbcb0990aa	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.800705
ef828910-261f-4208-b1ed-b43ce0d053e3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:07.909686
7130e3fa-3540-4c5b-893d-7900e5719257	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.010655
109f35e7-56a7-4100-b0c5-5cfd88156358	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.053777
14415353-a649-40f0-bbeb-3025bae2af0e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.134373
707f0aae-9201-45bd-93de-b6af4f629baf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.206165
19c60794-7179-40f1-9eee-d306739e0547	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.249126
b2deb9cb-7c82-4823-a219-b86a08f9d782	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.418432
7540c97b-ea46-4401-8b69-ff4d39f137fa	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.490339
c1e435f5-87cc-4ee7-bab8-7ae1d3a7d7b9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.569665
0b17cb98-e5b6-4a71-a456-480167ad278d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.662788
f28f5acd-fdb8-490b-88f0-e0a083094245	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.792579
9dc36056-4344-44df-9136-67c3ab250fe9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.856506
9eff9438-659b-48ff-a1c9-6dc5c9a77c3a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.897008
4d9c37d4-da95-4923-afc1-1351bada273e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.00631
15540639-d153-41e3-bab3-2a2fb3418b20	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.105369
6359a437-1b6f-426d-92c2-20043408dc53	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.195708
f39451d4-a5b4-420d-bb61-3c819bd06a03	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.301783
e9a04580-5c1a-4e65-8fea-7d35f261b886	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.380598
f9dff4be-24b8-4bd0-a445-ee00a7ca5a5a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.456276
5778a276-8615-4343-b773-ad4f1810c3b0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.558103
ec6324fa-23a1-46eb-bb73-f4c49a0ab119	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.635693
d7f10288-a601-4912-a1c6-185088936817	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.745635
45dc1497-0625-4424-b622-8d85d91c31da	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.868036
3a8dcee3-e2e2-49c5-a6dc-126832a2994a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.15186
09bb1b01-5886-4d1b-8f03-f1fa43ab2d81	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.381525
0ae938c3-4f36-4807-9abe-ba5d376ac49d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.50271
272a6634-0ff7-4264-9cc1-9ec627d3f553	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.608767
c403fd5b-4ae3-4cc1-a545-791423501fea	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.710023
09e72496-ce91-4b30-a839-c2cd09fffea4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.829722
b5cdaa61-05a0-4603-997f-5f59bd13e233	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.95296
f2701231-ba3d-4b71-bd32-e18951dc28a3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.030303
c8929f36-bf77-4e09-a6b9-a7c21eca9a4e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.144208
bf92f973-0701-4484-9f77-8708e19bd06d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.923898
60928b86-5967-4f31-a1aa-c18dbad9aafb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:08.971098
9a099f25-5377-49ea-8ccc-adc9e37717a1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.040599
ac2a19f4-c1d7-4acb-801b-b139f3b8ae1b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.083975
5383f42a-8b08-4769-84c4-f4bf5a81dc31	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.155041
c4d9dc68-644e-498b-9e96-e67b2d1efda9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.219732
61faba80-73a4-4f1f-8064-0dcc1b9ae294	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.268024
50df175c-4848-4ba2-b785-cdb781065e6d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.344843
3e3bc1e0-3395-4e60-b5e0-eca347064f88	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.416463
d69511da-aceb-4df4-9457-ee5eeb30bb98	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.48098
df846c97-d643-4aaf-abc8-24647be421e6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.521463
995aee07-6a46-469b-afeb-66c77a87fe86	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.590862
da60d9f9-ae0e-4605-80c6-13689fd1bc46	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.666311
33872719-e163-4eff-a4a7-e0f1ecaa833f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.711518
675dc0f6-c93d-4cf2-a42b-f679b7b2c4bd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.780096
baee44e0-66fb-43b5-859f-c560b3f1a38c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.904843
e2a15cb0-f3ee-41dd-9700-7af23fab5de5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:09.978993
b4a22cfc-e88a-4a10-92ce-5f7d59a1a3f2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.269172
b8240a0c-f62a-4f4e-a199-c21bebcab957	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.435408
e4264a11-8d68-480e-9c38-01af9649e796	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.534976
41a3e90c-b0bb-4f7a-a24e-ec6863725706	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.582551
6cc72928-dc9b-4084-9a5c-2ed56d15466b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.66359
09c9f2b2-a426-400f-9b04-9f363caab198	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.738448
f6ec65c9-1c65-40a2-8603-81feb480d85c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.783264
6cbd41c3-4609-4293-a509-dd8b03b74bac	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.861237
120c9f90-8d5e-4619-872c-a9fa8f9c0290	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.91583
4b10a8fa-0699-4127-8c27-97fad1dc3247	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:10.986411
f7df36a2-5437-4f5e-92ff-e3f9b16458a4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.061341
b30d24c5-c52a-40a0-b7f8-637cbe0723f1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.104199
ca8104a6-5b79-4004-87a2-2a895683a60d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.216369
6dee5adf-d599-4b62-90c4-ee3b85af9c1c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.336962
5ef41695-7a14-444a-916b-92a223d15192	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.388041
cf9c5e14-9aae-4fe6-a7bc-9e1d05758364	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.464714
f42efce4-48dd-49a0-8dbe-046586ad665b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.540143
bac40b81-1848-43cf-8b0d-77ba61e22b55	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.605022
b9282072-35f0-43e9-aab7-2d8b3ec4851f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.656858
2d03843c-cdf7-4fb9-ac83-4d227d99f931	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.762758
c9cdb478-f1a8-443d-bf84-16430fe1d284	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.838816
7a47ad11-7388-4977-83e2-73222a45b924	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.911255
d46c3eef-18ba-41cf-a73b-e6c67ce11546	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.988001
b629d418-1352-4f82-8df3-c311077f077c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.312401
e1f080ec-d2c6-469d-8288-fe423eece73e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.427157
10951c9b-e0e1-495e-b923-d63e07980714	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.503498
c1e90080-3b4e-4746-ac61-563b68be074c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.577895
97b71247-34f8-45ca-891a-91df3f306cf4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.679116
493ed497-07b6-4a06-8fd5-7399e4f8e508	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.723047
9029c35b-a1b7-45d7-a1e4-8fe6a9252bd4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.802012
afb81ae0-8f74-4351-9cc0-6d236edc46f8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.872733
477dfebf-30b0-49f2-a094-2dff9f975162	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:11.947188
4a423291-71b3-4177-9bd8-184dd8a7ff61	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.013268
ad63d54c-bbf7-40d6-89cf-59603104d06b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.053416
a82cf8df-e83f-4581-b3ed-20a21eba8052	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.128145
beb826d6-de1f-42c2-8c7e-caa9e936c020	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.216898
2b9c785b-4c19-49f9-98ff-387502bd73f9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.378292
b2b94f13-9a77-44b8-a7bb-5514b92193fa	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.447354
83f940bf-2ca8-4c98-839f-a5c574dc2057	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.519878
2e0f3ab6-08bd-4f72-8eb7-69ac83ce30bb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.581633
0099d4fc-0a35-4847-91e1-42ae6cf1cafe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.620149
797ec23a-7fd8-4292-963c-50c8f467d975	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.692873
f5c5efdb-8a45-42c8-b538-a01f39f9f66a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.759239
7d48ba77-8daf-4194-b124-99401ccbb473	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.089945
19053e0a-686a-436c-abdc-f88c19d073ee	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.172817
2a6aceb4-736b-4b00-be65-4934a27f2a6e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.300561
4a8e96d8-5606-4130-8ab6-f124c7c92f93	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.411163
991b2731-f1ef-421a-bda6-037ea0994ec8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.48896
d3ce42fe-11a2-41cf-bf4a-2c18ea713c0e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.557172
75c4f260-81b7-4bd5-a3e7-a74956ae69ed	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.659485
7e7e3d44-cf97-4202-a34a-20b6e6a30855	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.732589
dc33b98f-24a2-4588-b45c-29438a0b6c3c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.848788
1ff201cc-597b-425c-a10c-aaba2cf14dbe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.956264
c290ef5b-cee9-45f9-a476-6be99629c4fc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.03447
d19c4331-1598-4334-8af8-34ad4c1c8784	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.141014
04d92144-565a-4e65-9f49-af46a9ab9094	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.238644
42620993-ae2b-4e7e-bbeb-d3ffbdef2c55	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.284967
a96a4a23-641f-4d72-aa5c-33094332ada1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.355936
c6f59f81-1312-4302-a5d6-9e0d19661174	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.429648
cf92b4a7-b1e5-4ae4-bb8e-0475f2c9e9cd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.503259
221d24c6-23a2-484d-b5c5-4fddedfcb5c0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.612255
7e2594f4-5306-433a-accf-b78d5520f483	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.716475
f6a9be19-d659-410a-a16d-8e4ed2d18879	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.805954
f8038623-e040-4a56-b4ad-d3ee1a448c1a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.80473
77f2cefc-a318-4e62-8fdb-d5b80c0ba82c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.873002
459d85cc-61c4-4c04-83c8-ca0cf0785ad9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.919516
f9dc3bce-b33a-4a51-96f3-df56d3247a69	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:12.993246
0091bbe7-154f-4743-8b27-c1cec4536df6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.060042
8f7ac6ee-3b3c-4d50-8d6f-fb88658d786f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.100017
558fba75-387c-491f-b86d-7e7140cf44ab	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.172001
eed6f3fb-b901-4976-a14d-cafa10eb88bc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.215974
5b171ac2-56da-452b-8b02-38ed65b17c15	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.321866
f68413f3-1f01-476a-ad98-ba7ea2a9f242	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.399203
8806f5af-4f1c-4048-b785-a70e76d6d2c9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.531521
fb598c0f-6efc-4c9b-8fee-dbcbb32c2896	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.570864
11703efe-e549-4ae7-8694-98a3c7586623	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.635921
cdbea252-e161-4f8c-b5b6-58e172b59330	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.678373
ea6795b5-63f8-4fba-824d-6872c8ab277b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.751465
bec5d03d-0f1a-4671-a3a6-089e2095cbca	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.834903
cbff12f7-aaff-4287-bf60-a4503c84d878	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.885542
aab0e81c-806f-4fc3-b0e3-054b80ebf801	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.968706
3e365a06-bc46-4e33-8ca7-730d0036d181	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:14.057605
72706536-25ad-49b2-9367-6b058afbec68	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:14.135003
b1224529-7cce-4028-af3f-8d1ecd81c76f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:13.930221
ae95108e-3ca1-4f97-8e1e-deaf96c1ac5c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:14.019601
23fbe4c2-2796-462a-a5d9-bb2992ca55d1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:14.104375
a843fbc8-f395-4941-83d0-b4cb231b9574	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:14.88722
8e0e17f5-ffcb-457b-a595-35d1ba8a5d54	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:18.506913
90b79127-b404-4c87-9e49-099edd593757	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:18.611274
e88dd94a-1254-472b-a995-41ee9d671f9b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:18.695596
d92429a3-b159-43ec-9017-6af53b925ae9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:18.738787
be9ad0d0-b49e-4149-8ac7-66f2f6c8d9aa	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:26.845135
c45792ba-3e04-4dbb-8231-23c4bb7e0e6b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:27.338174
a3798848-1f70-4ea6-9b02-2a01226172b1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:27.913065
7cd95ac5-2101-47bc-9db3-d8cf258e5494	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:28.562003
c1f29655-2df2-4c07-9ab4-5226e67aaf56	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:28.81869
3a983dc4-87b0-4820-9108-f48a629c67d1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:29.176918
f26e0310-50ba-45aa-a34b-3c88c9343881	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:29.33769
75bab999-3edd-4083-a0ad-07fc4db6ce10	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:30.020851
2c783411-efad-4924-b4c9-0243b946ce86	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:30.076021
71e6efc2-b463-4b6f-8a30-975900a9b511	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:30.119221
1883e4c7-b236-4e5a-8dcc-d9b4f55a312c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:30.496924
8d3f1db5-6856-4106-aa3f-5045abc60c4e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:30.675895
27e44bfa-facf-4706-a005-efe1a284dc6e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:14.362286
91c596fe-5a75-4d97-a2a0-275f42ffbbc7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:14.972395
5357cf51-fae4-441d-b952-b381f698b114	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:16.373022
191475cc-6e14-45ce-b90d-11d4ca3dd28f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:16.416691
a48fcfcd-34d9-4588-a2e7-2884db68f4c7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:18.454087
29e8a759-5e77-4263-a816-218730002c23	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:18.568605
e3e5d097-27f4-4b23-b942-5fcdd9e15ccc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:27.075476
c46a7b88-f0b4-4558-8149-eb8793b6a26e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:27.107555
e6ba58d5-9058-4a3a-85f5-d939a459a613	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:28.322863
f446f695-fc42-48d8-9f7a-34ba5a2d57ab	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:28.369788
d134bdf2-2752-4a9d-895b-67aec5382954	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:28.413758
735a8f5c-20e8-4505-bf34-803bfc31d042	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:28.46334
82217bfd-d762-4e24-8334-36f18d643593	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:28.524006
38c4dde1-f186-4136-8990-e097167cf4bc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 15:55:28.571191
d788f866-b5e8-4e46-b779-a89f02b3a1f6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:00.868564
28e978b8-bd0a-4cc6-8594-b8de0077db8d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:00.974635
3dfabc5c-6153-4cf4-92c0-e1180e5df11e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:01.0707
dc2fda16-2218-4846-be45-1981e18a924b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:01.156768
0c280e9c-2c90-4069-b1ec-f39ad1a19668	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:01.209977
02b5e7b6-756b-47d1-a757-5b5f1823992b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:01.265329
145c08e0-dd7b-46ba-afc0-732bffb30e60	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:01.311491
76343d98-2735-41c9-beff-92b886fa1034	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:01.354995
fe2186d4-0839-423e-906a-fed1932fb610	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:01.412616
05783e2f-9ece-4101-964a-646725f3110d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:01.545082
20e1015d-8661-41ea-a6a0-8e69968bbb9b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:01.703957
41e0f0f8-b6a9-4ed0-b596-17e9722c4a02	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.002229
ad93bbd3-d664-4938-9b0f-e038408258c8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.139606
64e641bc-1ba0-4fda-9f62-f2990209868d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.300646
cc0441bf-9893-43e1-9fe8-eab9dace81e7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.461388
b31a0a92-a39d-4f84-99eb-e129d3d44a7a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.601327
a160f13a-5f8c-4c3a-a7f1-089cb6d2cfdb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.733317
e71326c0-6c06-4afc-904e-b3aa962029bf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.909077
63fff39b-8f01-4e55-860d-de9c79640e09	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:03.042155
db5148d0-eb07-4bd2-ac4a-9c699f715e4c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:03.206656
7aa93bea-75a1-4542-a850-19ec874822b0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:03.369114
036fdfe4-fd56-4c3f-ac7e-b64d813524fa	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:03.565875
4f5e3828-a013-4cd9-a9ac-ffa922b4d31c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:03.803811
7772e5fb-db17-4284-8bee-1c4bf4e91eaa	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:03.987343
66c56ca9-0137-431c-bd13-977610526548	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:04.127533
adc850e2-2229-4a45-be29-de37a1a9da3f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:04.369642
b969c3c4-228a-4627-a221-4aed1c9efd65	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:04.553113
ba351bab-0e6b-4b70-9ab6-6802cf1150fd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:01.446804
9845f0c6-3f13-4e76-9bdf-97db2b8da274	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:01.50396
12ef4ea7-376d-4ac3-b60c-afd5bef88a8e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:01.588434
cf9723b9-cd8c-43ea-8cd1-b381e94c84c9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:01.943232
e50eddf9-0b55-4dfc-bd7c-5b945ff37b1d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.092327
867dbc7f-4fa8-453b-81b3-73e28aa81011	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.183382
bf0da48c-404c-44a6-901d-d912c842f9bc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.270039
e38004b6-4bc7-4285-89d6-919fecb3abe0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.3874
c033f722-8624-4663-a9ee-82cb0f138ebe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.521151
40dacd63-3f8a-4540-9e1b-14046fd4b5e2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.674772
34ce1dcd-18d0-452f-befa-80e0bc4f6f07	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.775311
080b546c-b979-46af-b4f4-e4faedf1a7f2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.851551
9f94d0a7-d517-4aa9-9a5d-8f706b874d9b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:02.979284
afd00c04-4a25-4fc8-bfee-176ccd062509	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:03.13516
635ae8d2-8fc1-49f3-a3f5-c434e83f5f75	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:03.283947
3a87619c-ac7a-41a7-a8e1-98f10d5ec016	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:03.40857
228b0a4c-7bed-437b-b4af-50d189ab1083	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:03.500673
ee0a6a6f-f0e0-4b66-b6f0-643c4ce6f00c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:03.7131
7cd54f08-ec6f-4175-81ab-5027bbb065f8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:03.919362
09cfbedb-5376-4030-989e-b320616fc80a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:04.062415
61b7894f-e6f8-4f87-ba89-2a1616afcdc0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:04.173317
31bed61d-a618-4260-9c63-2c9f0ed4f2fc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:04.283714
a655d5ae-bea3-46a3-b993-4b1aae59d136	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:04.475932
1f55970d-ee72-4a5f-ae73-a2eb193a718d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:04.657852
4bf16588-b329-4032-927e-e6ea7c12a0dc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:04.912333
b6ed5f92-08c0-4662-a22f-db7a79c020e8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:05.060359
dd628528-a61d-4669-ba90-a813cd76da22	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:05.186981
b746ed0a-20ee-44d0-81d1-1b8238a6f5cc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:05.626352
193368ae-e457-4980-89a2-5ac64792e10c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:05.889371
5b5a9e9c-126c-40f3-a1e3-ec79d936d671	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:05.997761
6531f4e4-e883-477b-b032-1d7e4ca842ec	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:06.136198
ffa354bf-534d-4416-b150-0e2d76fd85b1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:06.308378
067993d9-b5ec-4675-a751-b1ceac2fff07	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:06.421596
6bddc02c-3c4d-49b1-b017-78ca3255e2fe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:06.600184
5cfbe09d-cb17-44ba-abbf-29fedb1d2185	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:06.696631
3ff2d36c-8489-460b-a44c-cc91d77c2bd0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:06.880008
b5c06d1c-7a3f-4d38-848b-f158fcd5e5b5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:07.091661
cea57099-66af-45b0-9d65-62abcbcc9795	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:07.175978
2e437e17-ebcd-4778-970f-7feedd9718cf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:07.373259
53367947-c132-4f3f-bf9d-134a4fdf2ff0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:07.543738
99d3e8e6-8378-41e8-98ea-7b2aeb753e66	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:04.73089
179ced44-4f1a-4084-9857-36b4c7230329	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:04.98297
04791bc4-bee3-4090-b299-d1e6c5f0f2c4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:05.130702
c40efce2-72d7-42c5-b879-26de06969246	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:05.376549
98f96b78-749c-4b97-bd52-b960a885e75e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:05.753211
6633adf9-017b-4b93-8ca5-9db4e30647a0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:05.947474
af84c668-d566-473b-aaab-56ca465fce29	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:06.222319
ef6b35c6-0a7c-42f2-85f5-0e60ae6760ec	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:06.37091
1395f812-1524-4ca1-aead-c71773e1a95f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:06.546635
17ef55be-9da4-4899-b208-2c4b569b08c0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:06.749171
32947959-5db2-4afd-8e92-8b8f961314d5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:06.98938
5a55f898-1f2f-4e78-ad8d-0192eb2f03b6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:07.211499
4d04838b-6bcd-4fab-bf8b-18d75f61ccb2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:07.305952
066005eb-999b-4805-99dc-81a0839583b7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:07.418397
9200d403-e67e-4874-a2f0-d920dd34a918	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:07.484674
2b37b450-652e-43fe-80c5-ec45b27ee493	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:07.602416
4f7cbd67-36b0-49d2-a93a-c86a794ce1cf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:07.757457
16e1135c-1dbd-4f35-87ff-289bdc6e5ef6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:07.902176
f1449494-0ad0-4074-ba12-b46b6c14075b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:08.120019
c2e4d76b-0f68-4e2f-baf8-e81c2ceaa4a4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:08.383133
88d385b8-6ba7-4879-8812-f630f6df4c0d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:07.725102
90f83b67-256b-4120-a814-528ac07adbb8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:07.842045
7e983b10-9e82-42b9-8279-f19b38a7c3b9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:07.948338
16b51917-12fb-4d04-a596-b63b444ab673	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:08.050599
a8895f40-b24e-4793-8e78-3787b9230cb8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:08.258575
9b192942-a071-45eb-a4f7-d4a00153c951	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:08.490202
8a8ffae6-f4a7-4e86-8748-b41603d56946	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:08.702878
d45f12b2-bb9e-401d-9900-32d974baa684	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:08.818274
fa4f0403-f90d-44ce-86ef-974343734298	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:08.919272
d0840e3b-9725-4fd6-934d-f5ccde7e57d6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:09.171348
6f0fc5b9-841d-475c-b223-664d4f2ed9d5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:09.426792
22240436-5476-43ba-95f0-6267680301c0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:09.738788
17d4ad00-2729-45e6-8f1c-3dd796ecfc63	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:10.072897
b8a92cd0-1282-4999-ba77-3abb2e9c84b3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:10.309173
13406a23-c435-4551-bc05-0e60161c9e60	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:10.458467
9097c543-37e9-48e9-ae71-792a809a3263	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:10.578477
b8b4aaa8-cfe0-4e37-a170-923fce1948a9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:10.666407
8b4a8f3c-7dcd-4649-8bd1-2d3ebe17f2dd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:10.793878
3167b025-b089-487a-8356-551fc06faaee	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:10.906935
c9a03267-a963-4b86-a615-c4a3c7dfdce1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:11.092941
df0be13a-9043-42bd-80d6-892148fc04e9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:08.574228
bc382aa2-fdea-45a7-b71b-9fc0e324dfe2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:08.76888
c4d24ba9-0583-4945-9711-68c0af85882d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:08.975398
19f8f882-95b7-4508-b622-ba602314dbae	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:09.105251
0b22549f-11ba-40fc-aae4-2efdee794429	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:09.341376
4cf506e9-9074-407d-baa1-d599100caabf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:09.511199
16c8835c-74ee-4974-bbf9-385a10a69eea	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:09.932762
632d9bfa-3b97-4323-87cb-fca3d4150a46	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:10.195207
2b2d1109-166c-4c7d-9b7f-335c3782a862	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:10.267388
9d9cb7cb-7781-47bf-8267-b7521da0afcb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:10.526306
6a7cb8cf-115a-48ee-8cef-d6aa5b5c61f6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:10.740196
c303ac81-27a3-4b57-bb0e-bfe7ffc16975	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:10.985692
8f44e3c4-952b-4082-967c-cf382ff28967	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:11.202513
80c733b8-031f-4a29-986b-b7c5bcb3d340	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:11.284189
ed09998f-e307-4e04-af0d-6452ed27baa6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:11.396709
1c2ed39b-b1f2-4d74-a553-cc7c72dc2d3f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:11.499704
8c7f216c-30cf-4a44-b4fe-5cb913228f27	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:11.609152
4dc21256-fe34-485b-a791-72e99d2c7ede	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:11.797959
72c04e14-0c04-4055-8d5c-6f253b5b4dbc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:11.925849
ee93ca6f-685b-41da-aa82-13f22834f092	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:12.053906
7ccbe2df-dfe3-489c-9578-83223554e68c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:11.157486
de3ea754-4f65-40b7-a282-048968aabfd0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:11.346485
ca9a5119-9247-4de6-8f39-0a474c720fd6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:11.455067
092f29ef-c417-4bac-99cd-577497654ba9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:11.729497
c7d9c7ed-d9bd-46a8-8bc4-86d60631c669	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:11.976579
f6b13cfc-e2c3-4144-bad4-e30699fc3384	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:12.112124
87822615-05f6-40f9-b1cf-08c84de2dd28	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:12.265012
6c7f0910-45cd-4b03-948b-e9b383003935	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:12.497444
8ed01190-7f67-4a9a-8a69-4364192a6602	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:12.656003
80ac05a3-f1ad-4dd6-9417-ab9499701b70	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:12.831669
65da9398-aefa-463c-9db8-300f573fc8db	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:13.007788
d3c46f30-c863-4895-a10d-de6c2e00e5f5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:13.338418
bad008ff-1ddd-438a-8c3b-515da85ef7e4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:13.571075
71990a0b-f78d-41fe-a466-edfe2192a5ac	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:13.741339
5273835f-4a6a-4854-bbad-8b19a71da979	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:13.913092
c910759a-7f13-47ec-a1de-dcb947e230c8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:14.076724
feaaf150-28b6-4357-adf3-87d586c7f312	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:14.305931
bd0fb43b-7ca0-4a7c-9039-71f6eb9de7c0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:14.62042
cdfec6a2-5f65-4a32-9c02-bb88cb3f9eea	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:14.839131
82ed5781-22a0-4d70-acb5-d27607eafb23	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:15.077843
7529a06a-36e9-463c-b3b4-ca9fe6b43c8a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:12.17239
2f0e1edb-aeb3-4564-9ea2-d4af9d6bf998	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:12.412324
70a7fcf3-52d4-4a5e-8fbc-a28d20d6b1ad	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:12.582106
f04de269-3671-421c-9f3c-f0ac5b63b187	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:12.766234
7c9baaeb-7551-494a-b82e-ea72a2b4b009	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:12.947625
c95ac14e-124f-4d56-b90d-f3deafc8294b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:13.08533
9a0aa549-82a9-41d6-b40a-aec517a17c51	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:13.508309
6482a855-7441-4769-aada-d8935d315816	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:13.678534
6086f79b-929e-4cad-b5b8-b0402fa03994	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:13.854372
a79e2560-ea8c-4d09-aa94-e3e184381024	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:13.992056
ed60ea1c-9454-4d1b-8420-54703ab91658	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:14.133468
e775e028-18d3-40d0-b4db-4bd59f8ecb08	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:14.246614
2ac28531-d8eb-4de9-a87c-c61ddf0a8919	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:14.476228
b4fd88be-4eba-47a0-b65b-affb9658eab1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:14.752661
5af7e882-9fea-4eb4-b690-f55408172241	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:14.931524
e2009fd0-8f23-4ede-adb9-a6f6510daf0c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:15.164927
95533d17-2b6b-4a34-892c-3225030017ec	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:15.328419
91bc0460-2353-4d48-8e69-aaa7dfd6addf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:15.489932
06c7fcfd-5388-4f26-8604-10bc84c9672f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:15.677678
905c8a4e-f00b-47e0-bd2c-0943f96a95c9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:15.783019
5263afb8-e569-4075-9d48-b6799bc9ae90	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:15.235846
37e49165-e7e0-467b-9d3b-035cabcec974	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:15.552462
cd31b972-a9fd-4a55-b538-5c33811da24d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:15.734837
caf3303a-5833-4d17-a3f0-98efc5ed2a09	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:15.973603
239a2a9a-7386-4641-8a6c-e6ba3de2a109	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:16.226629
40ebd6e5-011c-4e1c-9544-cbacd2d662e1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:16.557235
16ea161a-e54b-4950-8ccd-967148c8d991	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:16.715481
b71814df-af2d-4a7f-a22d-f3f5f232a857	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:16.973699
ab6658c3-b48b-45ee-aa54-6e3cb2981dfe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:17.112359
628d9719-3b72-4a65-900e-5093d0a791b2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:17.274642
16d03a8c-4b20-48b4-a162-d507b37b0d49	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:26.91452
1ae0dc08-e4fb-4dba-ba95-fc8cc551ca9e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:27.521065
3311f750-7854-4100-b515-a23235f12fb3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:27.664461
b186407e-e051-4f80-bbc6-288ec99b13d7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:28.29427
2b878125-3aa7-497b-9f3c-6ebbedd1fd10	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:28.469099
cebc73dc-aa1a-4c0e-bca0-dabc8443fff5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:28.747733
eab7af15-31e9-4e14-af59-37db0bb99e89	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:28.960003
68a55b70-e0a8-466b-b00f-287e3232aecf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:29.231724
ab16cca0-b43d-4545-9375-7a7ff3d90b3a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:29.392818
60379b2f-b77b-46ba-b45c-802b54de0384	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:29.540561
35180c14-d1c6-48a7-bcd9-4415aaa2b179	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:15.911665
9b7602c0-44d8-4edc-9be7-1a13ba482dea	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:16.091893
f19e14d6-e3e5-4f80-92e6-42363184949e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:16.329395
6ac00625-df02-45c4-9c72-7b13f8b982eb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:16.50442
47785aab-60c5-4e8f-9155-e2f2c083978f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:16.661867
458f22fe-240d-4769-8dfa-014c33ce9e86	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:16.796527
7f258257-d931-4ab2-9bb1-1edb98dc87c5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:16.895817
fb0d98cc-5298-4f94-a144-1f98ce9807d1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:17.053139
d73ff857-04f9-4e28-9f8b-342a6c50dd1f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:17.22019
24861dd9-1212-460d-b25b-1f6f2621899f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:17.349241
fd8bd1a4-ac05-4ab3-8578-4be2d88ff9e2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:17.641964
6f2483f9-1d17-46d1-adf1-d47f4dcc9de3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:17.709101
d8749ede-6cef-47bb-b449-22a6d0d51ef0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:17.78539
fae34a01-1747-4227-b132-668d24597b52	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.019718
6e590de9-13ad-425b-a68f-094c270829d1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.243219
b510f419-c755-4356-9496-76aab563101a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.303737
f43ad6ff-9534-4f66-8d82-ba54ac60435e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.362526
4a0872e2-20ed-4758-b5a2-ea324e2649f2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.410079
01d1238d-7bcd-47b6-b37a-5fc082e5ce60	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.460062
d6a5a36f-1559-41b5-8ebd-8b892e5a39ae	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.510296
69bef9bd-4d8b-4e34-872f-6017437846c8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.559864
0fb1c78f-227e-4408-8330-511db8d929bd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.611665
d8c053fd-bf8d-4d9b-85f4-25cc9851ee51	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.67139
e89d48f7-a52c-46d2-ab5f-74bac6d0e9fd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.718641
f8c390c5-7f3b-4449-ab82-e0a8ce88f75e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.768918
12e0e8d0-06fa-44a6-b61e-e8b0931cfc3b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.818941
e5a51cb1-780a-4c64-93b1-b4ace7e028f6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.867817
c9614426-0335-4670-9b3f-e562afacfa74	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.92281
040d8675-ae7a-4d8f-ab2a-f11d88fd93eb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:18.970549
fd76c399-ddea-4e8d-aedf-e9e802824e09	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:19.029731
93765a9a-a5f7-4827-b5c6-7996ad307f8d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:19.088335
97eb4e55-0cfe-4702-9cae-b353230fdeb5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:19.135862
53dba617-c447-40ef-9a29-80a19c9aa173	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:19.190027
30bb1262-dfad-4d0a-a335-484e3a8d7cfd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:19.27435
b8133b68-21db-4070-b5f3-1c4cfb233ca0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:19.407004
77a44fe2-b0d1-425b-889a-eb060d267c57	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:19.476682
2ab2baf0-fddf-4b8b-9aaf-530824b3e759	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:19.538137
5cd4ce9e-261c-447e-a045-2d3a61a16680	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:19.591873
93f6ab77-e2fe-42ae-9a36-2b5bb986ff1f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:19.650019
761cc35c-ebe0-4413-810b-a60b0513b169	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:19.705028
a0abf13d-aee7-4fd3-9b58-e73849c953a6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:19.75309
6116a480-b2e2-4350-8277-a2009d821bce	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:19.803663
69111cb8-15e8-4c76-ad9f-951a8fed2d2f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:19.84929
f05adc7e-83e7-4f58-aa1c-67db6a4ef946	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:19.897318
04b2e89a-27f7-4dd5-80b9-10db81bef019	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:20.051317
9b3ab06d-6be5-4490-b6b4-e9d2c6338430	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:20.10941
e33d1ed0-d4cf-4d98-8d01-51318f30dfe0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:20.159741
2c35c146-d710-43ff-8762-77e4cefb6cab	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:20.220118
1f6b3e91-1288-487d-92c0-f14a93d3dfd7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:20.268795
df2eaad3-142c-4f33-a070-aed325227670	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:20.313294
c098bfa7-9f47-43d7-9e55-deb9fc6b2363	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:20.413469
d2ae84c7-1831-4482-9d37-18f1a5b459ab	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:20.54584
8906034e-01d9-4ecc-814f-0caa769a6255	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:20.610469
c7d7baa4-4669-4892-a835-d562f0cc5cf9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:20.661712
0ad0a346-6142-4ec3-bc63-d0595ef05bee	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:20.744725
128ef0ec-4e92-4491-96b5-f5cc64c48029	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:20.799473
8afbbaf3-6f6e-4afa-86b8-6cbce7b351aa	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:20.864669
6929c823-a292-487b-9b22-09d87545d4f5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:20.925946
773c2b21-8b6d-4aa6-a337-a2e749da36bc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:20.987002
e1e1dc76-230c-4086-b0aa-93108336c5d6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:21.046147
1dfdb0eb-0f8b-4827-baf2-435d79666aed	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:21.095548
b2e175c8-07ba-4665-8228-8da3500663c2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:21.156825
c9c7c246-b44d-4712-857f-fba831a681dc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:21.217234
bdf4cb4b-9c7d-4b11-b5b0-6a4830f7e89c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:21.268868
9469da91-e200-4614-af7f-10b4ddcce5fe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:21.334581
545ab2a1-f52b-4dc0-b78f-26d613e7c0a4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:21.385014
b8d3dc0b-737d-40cf-b05f-958a8da392da	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:21.43516
5de28705-21e1-4e56-9186-de6433970bed	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:21.483381
d92b832d-ed0a-4151-9d36-79a367e10fca	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:21.539229
4a13d80b-8879-474c-9aa9-e0a2f6877216	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:21.638776
76226d6d-1fc8-4377-bdd1-6e93ab021c35	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:21.856602
a0389ccf-08d1-4c63-9cd4-f89398985bdd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:05:21.977245
0a4b28c9-7258-41b4-bf83-ef04282e166e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:13.348489
d58d725c-87eb-4579-ad52-d5f57e051fed	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:13.394764
20def1b1-5fb7-45ab-b252-dfcd1f3f8fb7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:15.226756
63e61db7-eaa6-4be0-b3ec-324e65605c16	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:15.290709
af22aab4-2298-4c97-9ff3-a3489d8f39c9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:15.373743
a483e21d-d201-4eff-b0b0-ad6abb8f7b09	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:15.427539
c32a1330-5f4b-46a2-86d0-bb851ef9e4fd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:15.472644
6585e58d-f71e-435e-b042-acf9d0e032b9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:15.509103
5d74b0dc-c938-4c92-a663-42a3ba10ad08	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:49.296109
99c84740-daef-469c-8b62-c4a7abcb6d5f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:54.34611
0cf31e9b-034d-4774-a992-f616598f307a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:54.423871
f137b45e-6ed2-4f9b-8819-4e67e5491e06	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:54.50478
78e5a656-9813-4d3a-8ec8-f9e1241720bd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:54.564944
cbde479b-affa-44eb-bb27-ba5f7b42c9b2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:54.621806
95870ad0-d39a-4286-ac78-c71ceb01b92e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:54.646591
ac115209-6452-410f-9b39-a40b11e80e74	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:54.694778
e9617797-3293-45fd-ac90-80452f6f2d21	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:54.725436
0b0a04a5-45f2-4b32-9bd0-f25740c14942	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:54.775385
a5a608ec-457d-4aaf-b5a2-9ad98039ed7b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:54.805952
f1714429-2c1a-475a-80b3-dc2bca11a0d0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:54.857527
96c2e6fd-ec67-4890-a5ed-eb32cf866942	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:54.925502
88005a90-9940-4390-bcc2-8308d82a9889	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:54.98989
6193d349-2728-48d5-a8bd-247659f4ef90	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.013282
380e7d7a-6718-4da8-8c68-5e5940fc7598	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.065885
763b9a18-aa9a-4a46-b7a5-941bf44a3139	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.089225
cbbbab5c-045f-463b-ac54-2911076c5833	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.135829
25c6d7bc-912c-49e6-9085-cd50223e4bf6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.161316
6eebcdb0-1fd5-4341-a517-2b241792e959	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.21191
bec70001-89cb-4e44-8d6e-ba967990def8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.238341
f1d6d99e-63b6-4019-849f-553bb92a7b80	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.359089
9c26e723-e8c6-4877-b095-f5f5034d2b37	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.441563
233200b2-c5c6-44c1-bf74-3fa7b7b0295d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.509287
6bbb22b4-9689-4a6a-8f3f-de91ee41c300	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.582949
2913a6f3-0e88-443b-ba1c-2113a218c188	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.663695
30dc8dd8-517b-43fa-bb81-72139c3d9a4b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.734683
2a329b5b-5ea1-446e-b7b0-6bdc1d7eae7d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.807541
dc47beae-6ad9-4a20-a303-47a16c17b64f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.880501
363f0b68-0c49-422e-972a-b06bcd753bdf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.955058
ab88da4a-4f66-471b-ad98-7f532d67cf24	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.135118
20cb6835-5c67-49f1-901c-f13a9d552033	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.207336
638a0718-017b-41dc-87c7-bb467553aca0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.281267
2836f74b-d7f1-4858-aac9-1ba8faaf7500	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.364181
f55be641-f74d-4377-b6f5-0ccdae538c44	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.447096
b3316aa8-89a8-4ec8-8251-aca55c062030	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.529827
e82d7f5f-d116-48e8-9c51-184931e39d66	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.618456
8278c0f7-2099-4582-abc3-e9cc6f2869a3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.697318
322503cc-616f-474f-a3bd-6168b1f43db3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.795407
37e47699-f9bd-49ee-b256-2a0c6cfd871d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.877604
9ab4fbfc-b1e5-4dde-a2a8-20609495c3a7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.960916
3649a634-98a9-4c3c-8e77-3aaeb27ece7b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.395402
b7783615-c05d-4d5b-b0b7-e10d798388b9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.467623
acc96fd5-5200-4766-b3f6-5c0c6dd794c8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.542098
55a96010-072e-4138-8fc4-a12dfcc37dd1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.61748
f83f5b33-9036-4792-aa92-fc3e79ec851b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.687488
3a8cca4e-6c17-4cb9-bc6f-f430337e6c4b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.761136
ec969698-c7bc-44fa-9079-73249f2ec050	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.832756
d62bb90c-dbaf-466e-b280-1b9704351e3e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:55.907165
cd5c4b45-db44-4fa3-9860-264cc4994cfd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.025716
c5c5ab2e-6d37-426a-9777-a3a36a8fd478	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.158102
c3637fb2-d76d-4191-a1cb-f325d0c94589	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.230446
d4a938d8-f14f-4273-ba7f-57ccd0a11552	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.3148
31ee4c4a-32e5-4d48-89e2-a1615fdb69d4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.392255
18ff237a-b563-494b-8cde-22afa10723ec	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.47593
339377bf-4944-4f76-97f3-e1888c42ad62	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.56528
cc693350-1798-4b35-a1b5-1cfa7ae02915	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.648102
1224b8f8-0cb8-4ab0-a0e9-c9937e8752f0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.738662
88cd0c6d-4204-44b6-8e29-2135e87f8259	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.824218
d7b0a9c2-6834-4251-a356-a9e697edae5b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.909281
362c7632-7355-4ea5-97f5-d5ecdbe047cb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:56.992263
e6418304-5bd1-4230-bfc4-8172bff7f0c0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.039303
95daf83f-fb24-4502-a3d1-4896bb9b4a35	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.197634
69a19a52-342d-47ec-91bc-bad6150899d2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.281996
97e805df-24f1-4228-9fc4-5953518ed1a6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.360813
3f458237-18cd-4e5e-88bf-59b1942c95f0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.440425
1fa32aae-ea70-4949-a9cb-8a83c3f297b2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.520706
5f84512c-c1b6-47ee-99ac-6a327a8c1195	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.60675
f9698efe-b78e-4e4b-9a48-fe4d5c529415	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.701527
98a3e826-35af-4d87-9f45-2cae81eb0d00	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.789506
232a9f67-ca8b-4607-852e-ef5df1add9a6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.870788
b1a8dafc-790c-4dd7-ad67-fe51184d4a90	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.955691
1f84c037-1a5e-4740-870d-429f0749ff1e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.041524
c9c527f5-df14-4a94-83cb-b3283d433895	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.12337
92d3f35c-1b63-4b1c-82ce-4c6fabfa4322	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.207202
869db859-2c02-4ee4-ab6e-ff60acc74ef5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.2946
39116067-443a-4c03-82df-2610ec8566da	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.378353
1554628e-d038-40d1-800d-6ee7527ececf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.463403
cb08ea5e-9841-4387-b928-5b53d07c38e3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.551343
0aceb5a1-4e3f-46e0-97f9-7584ef8b9fa5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.630093
52a84e55-4f4c-486a-ab90-02ebe0ef133b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.730322
5595f01b-7910-4d40-9d07-3d701e7ddfc9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.068258
b46074ce-f8c4-42f9-8463-afdb5c330f6f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.226049
c1b5fba6-2b01-43da-934c-e21aecb0faba	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.308031
479ca5a6-60d0-4c73-a0c6-1c641c7dfb1a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.386687
f9a9e557-b5c5-4e66-9d40-dc73bfd5746b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.469226
0ba8088f-8d03-400b-aef4-abbd51a9b4de	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.546594
343e9887-91d8-4f43-9e90-a35b490d55f8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.630745
6b364de8-7feb-4846-8d77-75970915a66f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.731045
caaf8373-81c2-447b-91cc-5c331279ad17	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.818704
29531ce9-85fc-42b1-ab5a-eea68a7a2a4f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.900752
8f728777-b039-46b7-8d61-aab0daae1cac	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:57.985614
4a5c62cb-35c2-4874-b43e-3936b8cb459a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.073381
19cd2291-af14-4954-a4b9-5d70e60facfb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.153658
7e429335-d01d-4b12-942b-f87c8726d2b2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.241926
c1f9cff4-0571-421d-bec7-81c7951688bf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.325816
8d4a4372-2dfd-4e22-9c1b-4168cf3c22a6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.409156
e157e465-addf-49a0-8f06-905f8a47c04a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.496721
56aff7e3-857b-48d0-aeac-5fb5630ac06d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.580331
568ecf98-0ce3-4f5b-9026-d33948904a00	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.669812
b5934be2-be91-4438-ad0e-277d2a38d1be	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.760295
3e26cd21-9422-48b1-ad40-d8fc3183d6ae	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.816134
f144d15a-5ab8-4877-a294-cd6ee815fded	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.095724
e3a26498-3f38-41de-acfe-4f4314479d58	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.195032
895924e9-0b06-4db8-92af-af7328fa7ce4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.275445
7d031cb3-681e-4c23-9b41-5cb744301993	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.356628
8b6d7d86-4551-48ad-8a52-df00c73b88af	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.443917
abbd9fef-f35c-499b-a91f-a3099a1a128a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.523993
8ab227ea-5acd-4b80-b649-1d32fb12174e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.608659
a9d7b1a5-1864-47aa-868f-bef21bb33b37	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.694598
55e1ffa4-e4bf-42a8-9b06-a34f7d053c4f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.775835
1d9bad12-ecfb-4336-8d6b-71bd2c83acbb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.946548
51337d7d-c530-4293-9828-097922191a3b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.037913
a875ba53-4754-41bf-a73f-69692a79c7ef	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.11865
73625edd-e005-4713-8e49-e41da02c32bf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.211815
c3af47e0-4012-4c73-8bcd-2f39739a8382	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.2912
2b56c6b7-cfca-45f0-bff5-58301f3e4a73	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.374647
a1c53bad-c586-4206-b0d0-ea7b50895dba	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.456372
27dd46ab-7c6d-4c1b-9b1f-6ec0e8ca2545	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.536748
d0af44ee-7fc9-487c-b5d9-4b2b44d19915	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.62216
2f460bba-a8f5-4a74-893e-39f6d5037719	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.701043
c6d43bdf-e9ed-4ae2-8360-5b801c72105c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:58.923291
1c75f35e-5621-4436-9ee6-4f3469791aed	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.144285
b077ec18-0de8-4791-8473-036619a45e3f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.2277
43f04a0e-1bb3-4917-81c8-e0f825d16df1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.307427
5254aa28-dbf6-4d07-ae0b-864944960f4c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.392988
2abc8129-c284-41ca-84a5-6c4ed5928ec4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.472708
02b0d5d7-1f72-44a0-af53-d455e06b9840	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.55683
99e55c1f-41ca-4505-8e77-675768f9b478	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.635805
dab2ebe1-2c5d-4c2f-9373-351515df5cca	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.723283
a74764ed-a7c5-4d55-8ea3-ce4f6a81ee42	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.877869
b85d689d-2142-4fce-b4d6-0876660159ee	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:06:59.983528
06fbdc01-16dd-4469-a031-787d130898ec	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.070762
391201a1-1c40-4241-b1f0-29d070be4e65	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.153943
08c2765a-047a-4118-bd7d-40c694a85fbb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.243948
e2b20b0a-f976-466c-9e4c-7bc2f6e96c4b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.324019
6e373c8d-0ba8-4bad-bdb9-124df99b0940	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.403415
6f3c286e-7982-475d-9e06-80e14492ce0e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.480663
5df4d5c2-676d-44dd-8217-4e2ed100b4cb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.567679
92118426-1927-4b3d-a57e-f9fabc38d578	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.652423
6f16efe4-978c-47af-9d3b-0994bf0b8336	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.737335
634fd952-cdf5-4141-858b-20cd6606493a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.782818
e711e3f3-04cf-420b-9bc6-640aefb3d588	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.87758
a897d874-8b30-43ae-9067-0076c3eb44f7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.965757
b6c23c17-1a72-4f17-8c6c-ab18c1fd0e18	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.061723
f5d7aa5e-890b-4551-b435-bdeaec9c99bc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.139752
b755b4e7-f67a-4c9a-9b49-2e760db83e07	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.219564
6e7ad8fb-1c2f-41fc-aecf-9dd98b6a40b0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.309574
8a65393d-0b0a-4894-b315-7fc195a7bb0e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.430912
921f7a3f-0104-4fac-8512-d2e49e78fe18	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.585665
2821af08-206b-4904-9249-7677b806563c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.660804
288e1dcb-65b6-4538-a82a-c5f8e171e2e7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.745717
66a53d62-049e-4ad7-bcb0-915fa9ce332f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.833727
6a2b42cd-c21f-42d3-81af-c83459bc71bf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.922648
3f75e5f2-e498-40cd-821b-2f3b7328569b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.003975
bf37e71b-d975-4066-a933-ba3fa86cf88a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.094652
a68aab1b-11b7-429b-b0cf-ccd5bab31e33	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.187616
038bb74e-8fd0-4c69-88f6-36df340ad257	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.321729
d648b461-4d1f-4c4a-831f-5953aca55fe9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.455907
cc5252f6-8b84-4733-ae3f-ad8e591560ac	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.549424
e0ec1b91-a8e0-4d07-8d2a-62ca58ab2f97	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.636343
6f49bb30-d7a6-42c7-9a6b-81a9be8e7193	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.811641
85e74ee1-ae5f-4383-928c-c3cd0b774070	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.91052
90da7ff2-e1e9-4948-832b-3b2f9cdaf229	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:00.997783
13cdefc8-5815-487b-b88e-6381aaed44fe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.087551
2b5ffc89-5013-4036-8a34-2ae61351121f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.165956
29f18e1f-35c0-471c-8637-34982cf6f1a1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.253514
bf6668d8-6b9e-4de6-99c9-6f66944dc00a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.33463
24df1635-e328-4742-99ab-62fc80ae46ec	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.528125
52482431-7c16-481d-a476-361c249b60e3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.614055
100e99b3-6d1c-4d07-9d65-de97dd681e1a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.69327
0ad1b296-80ed-4eb2-9740-37e787e7ecf8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.781038
a9ab1a53-37ff-4bf2-97de-42486acf41ee	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.865343
214b6609-2232-41fa-aed4-8ae43fdccdf0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:01.9541
07199912-3396-46d1-8c2c-7372990e64c3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.038344
5480c8d4-de33-4f7d-b862-91ea3d46cbea	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.125036
a8fb7776-21e9-4d1b-8f57-97440e5c2c9c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.218889
5265530d-f365-4e13-8b08-dce50e962fdb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.379259
2c37ae73-0fef-4076-8378-59f47cfdfda1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.493965
10f69725-9c4b-4f55-83fd-95ddd50f1d2c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.587337
22a17783-42b3-4de6-ab97-e12dfe7a120a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.671108
8302327e-9411-428d-a89d-167d7fbc7f92	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.810079
17b0d71b-dbdc-4ca0-bfc4-aa6e748b26a6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.919516
7aaf6644-7bb4-485d-8411-e0a82ef4f573	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.062468
6750aef1-7b86-4894-aa35-43a6e0ee875d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.189226
45f45619-3f22-49c4-920c-3dee193d980e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.314001
446949fb-2d79-4134-937b-e2cfc98e06ba	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.526683
8ff34d25-6356-4f48-a86f-9e81b1371cfa	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.584829
aebc87db-c550-4cc5-bc6f-d56592348d90	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.698834
d3dd020f-f328-4198-ac42-e11c67fba30a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.751758
e071244b-1d1b-4e9d-9291-a19df0fc93ce	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.846867
b2f5cf1c-a888-49fd-90c9-32a12d79e95e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.898064
52c47b82-196c-4269-80c2-87ed35d89645	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.989642
43f99f8b-1f14-4e48-8597-38927dcbe374	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.033941
5cc8293d-e2e3-4f47-bf46-5716195d4386	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.128727
c665ad31-babc-4a4f-b999-cb0345de936d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.175493
507c6125-9190-44a6-a4b3-7c4b15af9c39	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.321934
784f8eab-5dc1-42c8-92b4-0adfc3082939	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.409943
c8262c3e-3c8b-4d7b-abdc-f52432504f47	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.476517
29c715f2-2e4a-41f8-8d10-db665852c449	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.560976
c69893dd-ca4c-45dc-b615-91a243831b6b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.738965
30a7df15-ef7d-4fc7-a0fb-cb7726a05f56	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.858587
8f93d4d0-8307-4da5-bc24-084739700854	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:02.96406
bc4880a6-579c-46bd-8b70-01171e840c81	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.110475
d3f5ac42-ed5b-4ea9-8a90-a4a95d017f6e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.236922
77e23ee7-5e61-4dda-b82a-82cfd24cd12e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.385604
ed4777da-e035-4b71-8c87-1285634d80a2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.48674
40910984-67b8-43e1-9daf-41e524abbbb8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.617726
c3945f8b-3eeb-411c-b8c8-8181340db202	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.671006
6de509eb-9649-4f37-9d5c-bc32c1f889a7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.776663
955e1611-b559-4f5e-87e8-cfcc2f242721	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.819281
0e3bc6ed-2e70-49cc-8da8-3ec16bcf841c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.920991
1ee704bb-1f01-4b1a-aa29-682ae10f20e4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:03.963903
4839df14-f626-4133-bc90-2f9335c288e1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.059964
be7e788a-45cf-42ad-80fb-f6e2b2a9633f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.110121
e6e51ee6-0587-457f-82d2-5c7af0721331	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.206996
33673b6d-96df-47d3-af06-8f246965c183	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.25834
96fdeaf4-40ef-4099-a998-efecdcca0a41	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.434919
86d83feb-dcd5-4bfa-ab9c-5ab73b046c3d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.510574
1d11e891-5962-4bf9-abd5-27b707fc0059	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.676486
5861e8ef-cc72-494c-8e6e-9f51f0fc1033	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.771033
fafcc312-25be-4029-9e15-0adb68e83775	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.822186
b597247e-fd76-4f2a-b7c3-09b71120fd53	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.889235
7e151883-1075-4aca-83c7-a9f8910f029a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.951397
ee4781d1-4eb1-479d-b01d-4e1585d2e525	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.018305
d7d59b37-c972-481e-a429-d948254734a2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.084257
d0d5ab36-4df6-46df-91fd-54e81a3be2ff	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.179136
f6c92828-af8f-46cd-888e-fa62aac29376	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.317113
34309892-487a-4a0b-8d5e-24d94f5b9039	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.412532
2dcf571c-40c6-41e7-a128-e4effbe8cd3f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.528527
9f7be46b-a2ea-4c00-8e5d-fa78fd6ef8f8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.631575
247d6cdc-bd54-4a3e-ad4d-8c5a9d853448	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.680337
69107bf0-7a6b-4fa3-acaa-e524835d20a0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.763201
e308a234-6891-4e65-98b2-a2e54bafa879	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.804208
5fdae748-92be-4e07-9252-2cd193b7f338	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.898111
1ab14037-bf1a-4c15-bb48-92d5144b8bb5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.940189
d3be3e2a-553a-4352-bde1-f93e508fec82	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.033711
ea2de4de-8a77-4dcc-ba11-9ca1aff599e8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.102801
f798698b-9bac-4b01-96f4-aad1b265a2c8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.148184
d7c37935-380b-4a1f-851c-137142c55b1d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.236794
59d48031-9fec-4c28-9a24-acb5a643b405	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.298772
49a6f5ca-3c4e-4458-9915-6bf01862e54f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.847515
6b5bbc94-7fc4-49e6-b50c-3e8baf41adef	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.909292
210d3e10-294e-4217-aa56-00f517323a41	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:04.974782
2d3e01ac-e3fb-4081-b023-9937de9a7b00	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.043093
6ee2a645-3050-4218-8713-6ea7d9091e5c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.104196
b2770831-a815-4315-b216-95af5107c5d7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.24403
9541cf1b-2b0d-4c23-a6fd-358dfe21cb0c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.356625
47a1c2aa-68d9-4152-84be-3f86de1eaaa6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.472193
45b4ba62-4e2a-43f8-ba4f-aa318d287b07	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.556043
eb68c89e-0878-43fd-8e29-6db71ac65cfe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.60656
a4dff3d4-a8e4-4cf7-990e-115fcf6c6d36	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.7061
94ad18eb-7d7c-4fc6-87ea-973126628b9a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.745483
853814cd-4a07-4598-bad5-a8dc6901c5b3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.828053
e2d67304-a4c4-4e81-b589-326cb43b2be6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.876137
0122f6df-d7d0-4c0d-8e9a-444d206a0e20	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:05.959764
6de52a41-cb66-4a68-a6c8-fd360c0e0ed1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.008941
53a30284-a646-428e-9e8e-d76e7d7a5fcc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.073811
0ecd609f-1c15-4bec-8654-a9098e88fd15	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.167741
37442b93-97e0-49d5-b559-ed986f531b17	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.215523
a2b2a171-df43-43da-bee1-cd02035737b0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.280356
2839133c-0030-4ec2-814c-9d010b0a4bbe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.345326
4226d969-bd15-4614-ab73-464b4588242c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.436031
9d682ad4-8944-4419-b0df-af88fce18951	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.509044
74e03311-4c8a-4556-9264-49e3083fb491	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.550702
74be66ae-4646-48ef-a8a3-77bc202adb88	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.673624
43791daa-834b-4417-9c44-9fe86b574cad	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.75714
1d493cf2-7e6d-48b2-800b-c0ebbda4b19d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.807782
49919a10-cf80-47dd-9123-549bdd23971e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.896364
127f39fe-8fdf-492e-9181-8be17b47d1a8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.936632
053816c5-355f-449c-a6c0-6473c98ae6e3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.026346
b8c71bd3-4007-4244-93d3-f6e41687b20a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.071358
7d7c9545-96c8-4b87-8e7e-272515509f27	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.17326
58ba3cb9-ebb7-4823-b5df-b767c6f25c18	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.232981
ac103ebc-5053-439b-8a9d-c78f256b7641	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.368479
3800531f-6e9d-407a-ab25-a7fcf5f363b9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.47454
ccaf64d2-5a86-4fa2-a540-9ab4191f5b84	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.579418
c64819af-544f-42fc-8b1c-bf15d78c22f3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.762895
8159e544-db44-4b7f-8327-246b3d0ab1d6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.052112
8bfed860-383f-44a3-9288-b80e830d4ebe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.223175
77e91018-c9b6-4b9e-83e8-f7e073de3dd9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.282395
5114c272-9f66-4d88-b979-e4b513cf4d0c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.371765
e5075659-57ff-45f1-a824-5c815638bccf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.415075
13eab0ee-c3a0-4f5f-8d14-c12f55aca2a2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.480174
76ecacf5-1142-45d6-a30b-06da08d6e663	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.584395
0c815cd7-2f46-4fbc-8cf8-463ecef15889	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.641697
32c6675a-6509-4db2-a3b0-9ac8d281af57	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.725725
5157a438-2436-4ad7-9e48-a35bc3850fa0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.831991
d52245e9-755c-45f1-bf39-2a75e586e3df	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.877402
3cbf2b40-774c-4fbe-819c-cb57205d1370	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:06.961847
94123446-2d9e-4e0f-a9e5-336306d3cf3e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.002592
0d194317-84d9-4934-b7b7-5f9753e715df	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.099305
a2b5da36-1c01-4b34-8b37-bb64580cbdba	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.145221
fd7cd3b7-fbef-49fb-9b53-94a5ba75c08a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.262487
300be1fd-db21-457e-9373-c586c537d5ab	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.312401
2144e56c-9f26-45f3-b578-559d478f0cdd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.510482
1e869fe3-b907-4b81-90c0-6f1565587853	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.642571
468c3e1d-c878-449e-ac86-f2f347be16db	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.722579
3f5d7d39-3809-4d34-a984-7e84913534b1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.820377
d1edfc7e-a063-4761-ae46-f3bfde29d344	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.878752
a53d7f52-932f-4e3e-a833-4aa2858f3766	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:07.936094
29a1d3c2-efc2-4254-83ad-74fc236207c3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.004591
7b59e649-bbcc-4838-a89a-3303e521ca56	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.120476
81671865-7cbe-47e7-90b2-c4727f22788c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.179445
ec08bc08-cdad-49ea-bfae-0bb1e5e448ff	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.397409
04f86a16-ef2e-4ab8-bf55-82b18ffbbcaa	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.557139
dc7fe1ec-7921-46d9-88b1-465b02c9efbd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.754411
61de5a51-e435-47b0-964e-129e5cc5621a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.91943
b443f6b9-0515-4cea-b6fe-557b3f545f32	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.03831
8b322526-16de-4380-a75f-14d268590c96	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.238073
b3f4d0b7-b5f2-45d6-9850-ef156ff0c454	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.316686
7e56bc98-7307-4197-b759-87275ea4277b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.395055
05f1d3b1-f297-4b9a-a6e9-f7d6e39f53af	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.478428
4e9d1b3e-3f36-471c-8f04-e6700b0112a4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.563515
11996e04-3a3d-416f-a8f0-386cbc197c22	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.691378
32dc42d4-36df-44f8-b58b-70757cd066d3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.791011
bd9d9b4f-cb4a-4186-998a-84db49146570	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.880409
1ed05f04-8325-4dc8-b188-eba8d851c799	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.998096
ff0f9576-87ce-45e9-9618-8fc2e311b7a9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.061449
f7b47b15-9bcb-4d3c-9404-ea9810c6bf04	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.145033
a90c38f9-01bb-469e-b9a6-cdf6db8990f1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.232972
5496a967-42ee-40be-9bf5-5d3092a1c98e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.346385
cb63f231-932e-453a-9861-58fbfdc5c74f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.444393
d9c8bdfd-51c8-4daf-9aa5-4d73206bb21b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.499565
7380b2bb-2fa1-46f0-be90-4c7ee1a700b6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.623967
11ab511a-54ba-4e19-8ba3-2891c58dc496	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.68999
c6b26765-d256-4f86-8527-7f5215064cd0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.814289
e7177b70-fa91-4c4b-b6c6-e4918457f936	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.879752
01544073-0c42-43b0-82ff-c49759fca89b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:08.988118
8bc15bcf-03f2-407e-b700-8ba7aa2899ed	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.094898
aa7d4463-c968-4667-8c4f-6abce16352c8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.145496
c2c11f0e-a18d-4168-a013-b5eac5bb1df8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.192761
51ea0351-dcb7-45a2-85c9-88d27c45f8b0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.272906
bd5b9b57-1b90-4291-a9a5-53f5fbd40dbb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.347516
25446d4c-ddbd-4900-9400-ab35e9c6988e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.428174
1614967b-6c86-4646-b2ff-b893e13c675a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.509436
5604b755-3971-4acc-8c6a-5f5a6f41abbe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.597459
f1985def-76d6-45eb-9a01-e4403decceed	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.654006
704ffad6-3b3a-446c-92ac-6ba6d0429d93	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.745516
be69ad31-dda2-43e4-8bfa-dfcc653c3e04	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.828644
a5344e22-dbc2-4647-af3b-a47a623f9227	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.913494
1e008ca7-1848-4acc-90cc-aa776231714d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:09.967703
4eb0969f-7a20-4a1c-a753-00a823eeeb78	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.105993
695a18c0-c394-49e2-b11e-2a6d7021db39	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.192157
690f1885-b261-4f04-9dd3-233344c24645	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.28609
34324e6a-761a-4a4f-8ef8-746f2a04316f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.367569
a06dae4d-0c6c-4ede-bf3c-1980cc559a59	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.60488
0cb4d7b8-4dc8-4a82-8073-a7ca7c024b33	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.68857
f211d892-5725-4368-bbbe-3de33bb35c99	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.818428
bcf41b4e-280c-47d4-afb4-560aed380748	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.914474
5d61b717-73dd-46de-90e0-133bbe1aaffe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.005069
0b48c18b-c103-4b18-afcc-5ad108af2467	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.155786
cf754c8d-868f-4866-b5b6-6af1d5cbf021	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.319339
873e21b7-a57d-4c7e-9d7f-5df06e7cd302	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.416279
f7a808c3-97c3-49d0-b2e8-c65949f732e6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.790148
702e19c8-9534-492d-8cfc-ea40e7f22787	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.933131
8a8975b0-64e3-42f1-8ad7-d9718e6b9f91	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:12.063878
8827bbb3-04f7-490e-843f-8b9ee7695a7a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:12.406971
060711bd-900d-4e19-8848-bb93824b8530	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:12.485151
ae419b81-aa05-414e-bcae-2ac3f2e0f025	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:12.538874
38c6fa2d-dfc9-41c3-aece-de507d6a216f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:12.598928
4da72f6c-22b2-48e3-9baa-f9fd496b54a3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.318615
d7836476-0afd-402e-8beb-652016569c43	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.433454
cb9450bd-5b11-4b49-88c2-a4ae6a5f9721	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.560343
110f2c01-d70e-426a-a10f-cd891db2b3c2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.644334
250ef2c5-2e28-434b-81b4-99d01799cad3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.730497
5fbb90ef-d1d1-4d55-b63a-d3f6d0324879	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.782049
81ed39e4-7ea8-48d6-9f56-03c8f357b0f9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.86609
e5b18491-e469-4ed8-b004-3891612459a3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:10.958326
884367d9-440f-4cdb-bad9-3044dab52ce7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.049451
29944403-196f-48b3-9f07-b92a0990f123	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.110996
39f9d94f-e6fe-4d31-88f5-2a6ddfbaca94	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.216925
b6ea6b99-d2da-4edb-9bb8-d7b9557c676d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.271757
29be8218-464c-497a-83b7-e285b695f9e0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.360475
5b5884a9-f11b-4702-a74e-2017d34d2301	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.460012
b8d39b85-63c4-4ad7-b9f2-e1987fd4528b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.524617
738510f2-f46c-4e51-b5d6-e265be843639	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.586932
f21a61d6-ec58-4ce9-be95-2877ece88b1e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.633489
48a5c6fc-bdee-4b92-9962-389b0b6316bf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.691275
4ab6afe2-3e5b-45cb-9f12-673c10489a01	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.743665
7639a0a6-e4d8-42a8-bf52-4f934bc0ff18	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.837324
c7bfa774-cf09-444c-bf21-af98555fddaf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.886375
1b3597be-2fc6-44c1-88bd-e462347ef46a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:11.96931
bf7430ed-dc82-4a3d-a6f7-8adac2d4f181	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:12.024393
23563535-9d71-4901-9534-854de8b01455	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:12.114036
a30136a1-0ea7-4f65-8263-4a746bf3ad57	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:12.202901
0f2d8fd7-e915-4135-8a5e-f0583a75f622	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:12.655797
d55da320-aeb3-42d6-ad4d-68cb22ca4cbf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:13.176542
09e758bb-657f-4a68-bde4-a28e69adde93	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:13.62754
b42e3333-3ffe-4f78-b168-62e0d420c80f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:13.787694
a95ce9b8-9aa1-4d5b-a5c9-f141133004ba	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:14.045796
18ba99b0-086f-4151-9eb0-625f07c5e49c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:14.347196
a6ca1d06-aa53-4fcb-933c-5200f1d10774	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:14.844178
94ff33e2-a0dc-438f-ab9d-b8258e56d125	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:15.190432
1116206c-80bd-4982-af04-764067b0f7f1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:15.536584
4e7163ee-2fa2-4245-9242-cce1aab4374b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:16.104204
a114def5-77bc-4384-a0d1-9b7c6da30124	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:16.612481
0686ae8d-552a-4862-bf7f-722e49d2b1bd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:17.086525
5d37df81-dcaf-4928-abd0-4c51251b7648	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:17.805583
6e713274-1478-4266-a9de-2600e4829666	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:18.159035
e8b65587-ebba-4059-97dd-0d87ef75bd1c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:18.592096
543d3b79-f7af-4ec2-a592-f2d86c1b1aa8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:12.714788
ebd718b4-36ae-478b-b051-ea31468ce524	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:12.818719
86e6e1d3-e292-477b-a5bd-a308e4883bf7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:12.90586
85cb3920-1953-4303-80dd-ceda664bc4c1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:12.967065
c86a79ab-0316-40d4-af71-a2ff13aefd2f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:13.028335
1dd721da-cfea-4dbf-8bc5-61171b9b80dd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:13.093176
8a854308-d54f-4137-94db-04d6644dafe5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:13.246705
fb5dcd5a-540f-4537-9d02-06708d1e70e9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:13.33647
ea33946b-5c53-42f5-a99e-c0909c65d78b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:13.427693
e76a37b5-8808-42c6-bb10-521af2f5f55c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:13.692707
005da1c3-e757-44fe-a9ee-585557954e64	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:13.918202
351a5ec7-ab64-46a4-bf60-08cb6a23d611	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:14.175057
cfd5348a-e3db-4ce0-8365-4ea1f25ac441	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:14.677808
1e2d1078-b8c6-4a9d-9f08-4f97a5acaddd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:14.992255
29b00f56-eb0f-4ff4-82e0-eb035d17d557	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:15.125199
c7dd754b-e807-4b6e-a968-944fc640daf9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:15.621746
79653949-8b83-4e07-8db8-db4b0bb1ab59	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:16.040123
3cf40001-4a08-483b-8261-2830d8bb95c3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:16.540287
34107a02-ab35-4297-bebe-58fcce80d90f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:16.943103
8f8251ec-6c54-44b9-bbdd-ef3bb136ca4d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:17.523553
896b46b4-e7e8-4269-968e-992d64678dc4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:17.921404
4ebf0668-6ee9-422a-aed3-fd56df72c4f6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:18.291551
72d1486d-0a2e-4f69-a63e-1c423a09b818	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:18.861378
564c8f76-f01d-49dd-b5f5-d30d782bde2a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:19.392146
ce9234b8-ae28-44ce-96d4-f4516c8ebcdb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:19.921824
3d79da21-b295-4619-b163-8336d1731a47	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:20.314094
f91d627b-62d1-4472-85f4-e626d0681ce1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:21.036291
a793a494-38f3-433f-b968-af4a8959c5a8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:21.789808
830a9331-5dfa-4f90-a196-50c249fcb733	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:22.808848
d12adba1-6f1f-401b-91d0-31e309d3ec9b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:23.100155
4fb658e3-f4db-4c52-9288-315ad0edf8da	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:23.836692
b0e8196f-b1ab-4743-b561-49e57af98e4d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:24.044439
dccb0733-4560-406f-95de-36b723534bad	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:24.40471
5b1196ec-4a14-4678-ae63-5a6d2c19cb1d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:24.555646
600ce81f-9a43-45c2-bfad-1cf48bd85f7d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:24.842679
8a1ab135-0a90-4b07-ad46-b248c15adb48	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:25.086751
e5d71292-9425-423d-9be9-7cddb2c189be	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:25.297187
3930a227-4c98-499e-82e3-59bbc2881fe3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:25.491591
38e557a4-2d75-47c1-9493-025a9eec2e8c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:25.761183
13c90dde-914f-4a84-b58b-e39ba804ba00	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:26.14031
17518936-f533-4d93-9ded-5d53cb9ad933	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:19.075646
28aa8359-0a8f-4d0e-9bc1-bc3731686823	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:19.488586
4fcc75cb-e411-4175-8d35-b76ee58bb9e2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:19.744749
0b8adf6c-6675-44fd-b86e-136da16caaaa	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:20.604888
19744e42-28c0-4eb8-aa17-9a3fa629387f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:21.321593
3cab5de1-df22-40f0-84c3-9b4bff0b03ac	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:22.161264
bfbb00f5-9f71-47df-8767-eb812c4d2ec4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:22.987753
aed39cbe-2a9d-4846-9bef-6b19a5f1f4f8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:23.72521
bb462358-edd4-4364-9f20-62e213163f03	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:24.10989
f053a62f-b9e1-43dc-a7f4-1a02a71e3af6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:24.340025
4491c05e-b9a1-4dd2-a99a-1fdb1de6fbcf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:24.648272
6ecf97d2-00d3-422e-bce1-64c5a32d7114	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:24.937479
325acbdb-fa78-4195-863d-f797fc326fe1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:25.162985
8cb851fe-4708-4cad-afb7-85d30e86d7e6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:25.413733
f8d0a471-be35-4d7c-8bdb-cd4ca221046b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:26.041016
913be7dd-74f9-4120-a877-886ecb64c115	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:26.414916
a1b280ab-a093-472e-a540-b8412b94e1a1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:26.564961
8c9cd88b-61d6-4c67-844e-c70cb50e9c3a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:27.03974
df1abd01-693d-49e7-b93b-2a60ce2d016e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:27.62222
4ca5f22c-7832-4511-a13f-13e10b4dec01	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:27.777404
37f7bcfa-a117-48a7-a3ef-4ee17d57ad8a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:26.360664
7f105443-0670-4d07-9440-631cf5bd5db4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:26.636559
384e2000-f114-4d7e-ab61-59a67a7a9514	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:26.780331
8a737b88-1680-4765-80f6-cc055ed49f2f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:26.988902
168a2bfa-1ad3-4083-bf83-729e2d8aac4d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:27.72751
715e04ad-4e3e-4c9c-83e9-ee5df41b095e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:27.84308
e0a39398-0de0-4812-8c5e-5659adc30200	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:28.519954
65881454-6a99-445d-a169-e72779cfe4a8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:28.674497
a30f752a-c667-41ce-a024-e2ebc84215fd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:29.064535
1ee72aa4-4c64-4933-a3f2-fb10ee0f6ca0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:29.279038
59d01275-a3b9-4520-94c8-017121b003b7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:29.647664
37b3219f-f7e9-42e0-aaab-e4456724c4a2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:29.814976
8ecd787d-f48e-4fc1-a4e4-c4bdceae8ead	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:29.912589
9007a8b5-1ea9-4026-a0c7-14f051ccee0a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:30.331279
19d4e880-b0b8-4550-8109-ef2b9d815976	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:30.413301
9a6850ec-31a7-4186-b218-eb01cb5f6284	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:30.563736
228a07d9-52df-4569-9559-245da404e08d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:30.608895
f5d0547f-80ca-4b94-ade9-ebee23b297e4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:30.713823
38b238b0-7996-4551-b8d2-5365dbbf78bb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:31.141324
4fa19c2c-b392-4061-857d-91c0018a4c0a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:30.994055
9c0b4f89-0e38-48fb-a4ce-d7edc5458f0f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:31.207984
6db934e6-95db-4c64-aa16-d65b08a620f2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:31.625083
eb2a06d5-7e2f-46b6-9397-64603f920a3b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:32.376582
e38c978f-0106-444b-b76c-21df883e5f8b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:33.075057
db9244ef-2960-45fd-89d2-fafadaea45bf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:33.472059
9108a5a8-84fd-47e4-8f02-1abe70e175ea	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:34.088845
a20fd1a4-a009-43df-8008-a7785b7a3ba6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:34.49208
3ee5220f-d15e-415c-b4f5-474973f3c2b0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:35.115177
cb71b444-0b1c-4016-bc12-5b2bd4b2eb58	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:35.809357
3fd88ce3-584d-42e9-b3c4-e26b21eee15e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:36.789044
f37d87d8-a01e-4fe4-8616-32d5b832a8b1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:37.006508
9a7d3a2a-9d18-4a78-acc1-e5cf1307edd5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:37.532547
11625e1f-1a12-4b23-97de-63c6b22dfcd9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:37.980753
fd8d55cf-a4c4-4a70-91fb-5d05add01730	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:38.375847
2464e407-04e7-4541-85f5-0bde37c8a554	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:38.770668
381c7042-51f2-42c9-af8a-14116f7247a6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:39.346827
e7524eb2-b8ff-4826-a351-eca1f8c1448e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:39.80505
d865a614-21f0-49fe-b077-e8bc9badb2a1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:39.879782
92048f1b-3e92-43f3-ba01-330e4aea3853	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:39.958141
f72ee648-f9d4-4443-a907-beb551caef6c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:40.043775
fef5d669-2d71-454e-a8dd-9fd826526c6f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:31.375209
a7cff1e5-84a7-459b-b004-152020d0f5ef	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:32.063653
7dc0d570-532f-4410-ac80-fbc3764594d4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:32.589721
07453323-d67f-46c5-80c5-f9b402fc15a9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:33.177403
5d46077f-6131-49e5-a26f-24f81edf61b5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:33.538702
223088cd-ecfb-409c-8c2c-fba3274a5652	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:34.034388
a3409718-204d-4657-99c3-0684a05bb21c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:34.32905
93de4d80-785b-4515-b455-b3443bde897d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:35.039271
2ae2a984-f83c-49a8-9ea3-d090de1c39c4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:35.937493
ff08f14b-2252-499b-9265-d851561000ee	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:36.689422
15e385eb-fd12-4c7d-863a-57dc9fdbbe6f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:37.20545
3bd39f7b-3cd9-45da-ab00-685930ce8f50	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:37.591006
d8ff84d3-8b73-4ac2-81e5-e45a41fec72f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:37.927203
6a9e634e-fd1c-44f5-84cf-d6392a267ff9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:38.440607
18b2c61e-7808-4c74-aa34-17b16bc8bce1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:38.875466
2b1e50db-30f0-41a2-83bf-b167aa4a477d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:39.403878
ad102ff3-57b9-44fe-b64d-6ea0c433f1bf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:39.709072
6a329413-6efb-4211-acd0-136f1455931a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:31.337566
47de3a3f-fa42-475a-8b9b-df07229c9236	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:32.013094
da76d3e1-cec1-47ed-b166-a1dcbe7b0dc5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:32.862966
4817446a-51c9-499e-8ab5-cc4f942931a3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:33.261436
89377c0c-a744-48e9-ac38-523604712325	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:33.718721
04e902c0-417e-48d5-a404-51a2980c545c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:34.161037
0891ce6b-8ec4-4f88-a773-a508f7713b00	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:34.564427
671822d3-e532-4f0a-a467-38d68fec386c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:35.332628
bffede4a-10e9-48d7-a3ca-704de8f584f5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:36.057451
11a1c7f5-f1a4-4a46-889b-ab4f13e08988	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:36.611937
b22b976d-a638-4616-a828-8b5831b0c5ad	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:37.39636
300c65de-3fc2-46d4-830e-fb4683975b2b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:37.711355
c31f9ee0-b929-4473-b1df-d8a77f9f189b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:38.211151
f3b69cfa-e626-42ce-9044-6f96fcf1fa4a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:38.59554
6979e637-1cc1-4ab8-8798-c13a7b033d35	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:38.976588
b074d327-fbcd-4266-977a-f296d28d4be4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:39.511477
b759ca8e-ea3b-43b1-b7b2-b9ea0e05a154	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:31.423471
f3b4e077-cd67-4cb7-98a0-98acf0d4c9dc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:31.807862
b3336770-480b-4248-a0e3-e91b98310526	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:32.761828
45af3449-6701-4287-bb8b-4d2c3f17231e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:33.130377
e309e86c-e7d6-47fc-87ef-4911c475974d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:33.588755
332f519f-b104-48a9-b506-67a91863254b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:34.23021
6db219dd-26c6-46c8-b285-4a216ffa9d7c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:34.695982
a9a9b149-08b2-48f2-b7ff-e3db91b2a2e9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:35.245177
cf31dab0-a436-4215-a2ad-2b9ce25c330b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:35.873317
ea6a5809-e71b-43f1-8402-4e21cf5efe03	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:36.740213
1690220c-06a6-4fb3-a826-f1d356f745aa	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:37.052101
0e48d128-3817-4a98-ab24-e8993756b9da	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:37.635418
b7718048-0ed0-40a1-9adb-a9a1ec2c567a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:38.03684
4f945637-c714-4539-809b-194073c522cf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:38.3221
c2f059c9-b2ac-4e1e-8d69-7d20b95fdf03	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:38.829182
b69dd1f8-a26c-4d83-8453-4345f8507b27	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:39.297898
8b52f12c-2dcd-49d1-9eff-b01fef7a71b3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:31.47799
9653f089-bea9-4398-8f04-2591993b3016	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:32.530858
8d92ffd1-5a1d-4046-ae27-67f4be35373b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:32.988185
1c360d9c-56cb-444b-93c0-fd70df2a8125	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:33.357955
8a7d5ad0-c26d-464d-941d-98012804e2dc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:33.939387
552debe7-9825-40f1-9245-50623b81662a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:34.437859
bd127f13-53cc-4838-91f1-0758e3f90f72	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:34.89239
12fda3d0-562d-494c-8e92-e0b9de002ce8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:35.550074
b0feaf00-359e-48e6-aa1a-33564d7dd466	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:36.394106
4e5bbf5a-a1b2-4214-89b2-a6571bcab08e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:36.905048
7845320e-567f-4bed-b099-8c05f4a175b7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:37.307009
11ca4de5-7a6d-482d-8901-60ec868c2d95	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:37.821865
04bf290d-2844-498d-b4b3-aabb9e2add7c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:38.156473
c8f3ce21-46cd-4c34-8c50-06283b47acbe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:38.54436
c68efcec-bd98-4d0b-aeb7-8cd929659c65	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:39.120821
a4062752-7638-4fce-9a25-14575d09ad7e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:39.557993
a35e8f42-4fb9-4957-bfb1-9cde0a90bdf3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:31.537945
7beb7a8b-dc02-40f7-8fe3-805c69cc42d3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:32.272069
5cf15529-bfae-46b6-a9e7-ffc60cf6982f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:39.447143
65d19e15-c5f4-466d-89a9-86d6b73897fe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:39.75534
6f87a237-3e58-4b0d-bc3e-3b87cd6a6509	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:31.589624
28b8e83b-ef86-473b-82be-1f5352b5218b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:32.474599
2f7ee014-c653-4b71-a846-050c653f0ed8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:33.028039
3a05f6d1-5ba9-40e9-90cc-1effc23741e2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:33.405355
74226649-420f-46a4-b05c-0b0c6db5658a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:33.97989
d09282b7-c3ba-43a7-93f0-692b1ff9f4a7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:34.377154
b450c764-f9ed-4d43-b23a-9e33170d662e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:34.973475
c0826ac8-1fa7-409e-87f9-48a69469aeed	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:35.456272
b6d7a189-960b-4d22-9eaf-51d55e6e833f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:36.168494
fe175c71-69b8-4ff3-93a8-cf5ea920641f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:36.841188
40845081-066f-4157-bce8-b5a306690810	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:37.352218
a0e6f272-c65f-4a5f-b335-110cd9b5293e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:37.763923
4e37bb7f-19ae-4ff0-9e4d-406fd686dd07	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:38.112716
321f4e72-e96f-42f3-a136-426e58200eac	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:38.673343
7beb251d-cae3-48e3-9bb3-6a0605c99936	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:39.189712
f2d3b5f6-efc7-418e-90ed-ae7ba136be52	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:39.607031
4d591b61-7b0d-4876-9eb7-9ce5d0b3f1c1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:40.127889
aa5ba107-f791-4e1e-81b8-e73677636a9b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:40.262761
a174be92-f60d-45a9-866d-d3a7e7a9968f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:40.431762
8b34968e-6a22-42e4-bf41-f0ee9d38f464	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:40.512467
306fe773-a3a2-432f-a620-a6752fdf0adc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:40.682575
f2287f94-db10-4b5d-a253-0632059f9808	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:40.927975
99636a64-7b1e-4b49-848f-30dd647797e7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:41.041412
9231bb1f-8d59-4b44-82de-b25741862725	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:41.424688
fdb507c2-cc1b-41c1-8408-5f9dc9bd0687	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:41.527932
2985edc4-63a1-4708-922b-627484f9a08c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:41.614322
d66d3e13-fed8-416d-986a-ec1b707173a4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:41.687136
3859feeb-9c4c-48b2-b9c0-7d8e74fdc4c1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:41.76603
34f567a8-fab5-4bec-aef1-65ae55a6273e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:41.842306
a56f07cf-3736-4a79-926c-936b7aa13d3a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:41.914812
2b0413c0-7e4d-4b31-a4dd-f34be8554595	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:41.99459
48a447a8-31ee-473f-bb23-a925935be37a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:42.079962
6e0c1fbb-4806-45ea-a951-03a80f611099	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:42.14091
2e351816-62b4-4fc7-9276-c084952c5e54	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:42.196469
df01a5e6-cda7-4443-ab40-17fab11147b3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:42.259872
a92dd8a3-6342-45a8-8087-729cc6b24d49	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:42.330467
30a3ef9c-32fe-4b2d-9625-e24c9c645384	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:42.397849
82819999-80b6-48fb-99e4-dcf3a62e8f42	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:42.452279
2a930a15-ed8a-4b79-8e97-20192a04fd23	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:42.518282
2723d5aa-fecc-423e-8d97-60ca471ab58b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:42.592902
4b52da1d-e6df-4e70-a5da-90191636cf83	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:42.669921
a4d8c2bc-88b7-487b-b2b2-7f60581eecde	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:42.742977
00cf54d1-7af1-44e0-94ad-d1fb26e7cb2c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:42.796695
f40262f3-869b-4440-9b66-fb18d2361c82	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:42.864869
97f4a4e9-a7f3-4dc1-9897-75106026e423	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:42.930617
7dd19ed7-27b9-4305-8f8c-c3b6261acbe9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:42.9954
8ad6f03a-a2de-4135-97f6-eb01fcd2f1d1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:43.055302
98ab949d-e1f5-4b46-a9f7-16b4aa4932d4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:43.106412
018243a3-95c3-4125-bfc1-02509527516f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:43.263534
3e8df3e7-3b3a-493d-8a22-01f4adbffab9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:43.341113
8b4ee84d-1ebb-4889-bee2-ae13f56fc4be	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:43.404563
0e25f111-e468-4057-a9c7-2bb577b0c8f1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:43.496338
90647a1c-eaa5-462a-ad4d-211fa45b75ee	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:43.6273
7f8c6bcd-cc5f-4e65-bc14-536f8a710565	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:43.688745
80b39bd9-4d7c-4ed6-8d88-237b3302f4ca	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:43.75126
7b78f0eb-7ac3-4382-a598-377cefc77c28	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:43.81403
852fe008-8b1c-494a-b352-8329a603a3a8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:43.869775
28d0145f-34fe-4c84-9180-5366ca12b668	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:43.941213
35f92c05-5b7d-42a0-ae07-1669f235d3ea	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:07:44.00767
eeca1e53-0534-4a2e-80a0-521ec4ec69e0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:24.395538
af1ada75-6446-456e-ac63-cee12145bb0a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:28.702737
840c29bb-cea8-4ebd-b1b6-4ad15b5342a8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:28.78155
382f55fd-466c-4292-ae15-71985a6c1fe3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:28.911121
782f2758-8563-4d2a-a059-c695306d4e14	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:28.987769
97ec6d0b-4ca3-4fb5-83a3-2bc1fc084ce9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:29.043146
76a789ba-6503-4a34-b718-4fb11484da98	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:29.091596
87aba1b3-d066-4e49-83bb-208651c95276	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:34.684775
699b3473-270b-40e4-9f6e-1c74bdf299c4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:34.726874
1b7a5b21-3db5-4c1f-ab1a-c22e991eac87	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:37.134864
e8de89e5-c045-4303-8890-49c9fa97dbeb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:37.176881
81424c11-503a-43d0-aa9e-760508486507	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:37.24018
a25633ce-9c5f-4807-80c7-ccf6a00d6d4b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:37.284743
8151a612-d0b8-44a6-a617-023f9d515df6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:37.346543
67f95e63-1258-4ea1-92bc-0db6d4dde81c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-22 16:08:37.40118
912fc1e4-659c-45e2-8535-f2e795945131	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:14:18.981219
5a742711-5c9b-47dc-8785-8da67cfd72fe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:16:05.976576
d43ac4b2-2c48-4aee-931c-2d244d0e1de7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:18:04.281132
79ea63fd-bc2d-4c75-a86a-3bbbfce8907b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:18:04.403343
a271ef30-6b11-4ae0-a47b-1008438e92d4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:18:04.458306
1a7bada8-ac57-49cc-9e42-754b6879ba07	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:18:28.886894
3b041487-cfac-48f3-8120-748bdb33c168	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-23 13:19:44.753721
31710314-581d-4fe0-97cd-585cad112b5f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:20:05.389891
f88f13bb-a792-4774-8168-cde160e40d9c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:22:10.136043
b96067c1-6f24-42f6-b43f-08ebe44c9bb9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:22:10.165861
bea65dea-f181-42a4-9abc-2742e3fd5aa5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:22:13.026314
59bd278d-a53d-49c2-b8db-d70a7d08e605	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:22:13.151957
c3eef7e0-3c05-478a-80dd-4a4ce314948d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:23:57.000783
1e63cb80-8fd2-48f8-9699-5807c503cad6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:25:53.422883
61962007-f1b2-4e29-9d49-8079142e4563	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:25:53.535
da923329-0382-479f-967d-ac112e5a0935	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:26:17.73634
b760153c-1b8f-482e-9e91-a3d20076666e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:26:17.869455
801da5a8-ec6a-44f1-957c-10cab4c380ad	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:27:12.539761
83134e3c-bf43-4c2a-a61f-8fb9ac00a9d6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:27:12.567652
8c366dab-b282-4111-b637-e189f79c9166	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:27:14.175615
2dca76fb-77e8-4a3b-8c03-01d5c90965c8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:27:14.210486
f0a43020-d7cb-46fd-90bb-e2b9cc5eebe3	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:27:34.282006
e638979e-0bef-4425-b7c5-1ca6c0349b3b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:27:34.308865
62cb3d57-8554-4cda-80b7-f3512648787c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:27:36.250645
24fc02ce-8f5f-4521-affa-96a4fa7615dc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:27:36.290056
daf91f47-dfd7-4309-a838-41cd24930d59	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:28:53.494612
42be05d3-1071-465e-a78c-700666c51f8f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:28:53.523494
92c27d1b-be68-4cc2-8cd4-a00e7bcb2ddb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:28:56.945486
08f826f1-501a-4c89-9670-b6c12c03cd28	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:28:56.980221
3171dab4-7245-4fa0-a772-b2192394f1ab	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:33:45.679452
ba531acf-c59c-499f-80b1-fa250bd57a61	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:33:45.712719
7fb606ef-7931-4ef7-ab48-83908e461670	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:33:47.361213
63c59dbc-5a99-409e-b6bf-b4ed47e56143	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:33:47.402316
8c792751-904d-4303-afc4-e5a89c8b084c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 16:33:52.466442
60e37f3f-6b52-409e-a0b6-a035618bac3b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:10:02.760483
33862b06-b854-4221-bf23-cb6d63e07ccc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:10:02.807041
4759d9c7-8a49-4862-9298-197989485d7b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:10:04.495709
34650d4b-fa77-409c-b300-31ff9c2eaef2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:10:04.542458
5669c36b-ce7d-4052-9332-473944682710	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:23:58.54423
3d765ad7-b7e3-4cba-a0f9-09ed4cd49781	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:23:58.603043
f0879155-1853-4a92-a04c-3e682213bb2e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:24:53.996714
2e3632f6-ddcd-49ce-8c8a-ff99357967a6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:24:54.043063
23bb48c9-c800-447b-9bd6-7186a583d32d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:24:55.375913
994753ea-90ff-44b0-a40e-9eb3fb602e08	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:24:55.401577
be8137eb-16fb-48b3-84c0-5f63613cb4ef	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:24:55.487685
f70300b4-25c4-4677-a1d4-3b1523be97da	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:24:55.513963
63ba4179-92f2-49bc-a7f1-cba9b0c871ba	\N	20398b85-b45e-4c65-8352-80107db982eb	update	user	a5ef1d1d-f6f7-41b2-a066-513d57120ab3	{"action": "updated user status", "isActive": true}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:25:41.658615
ab9d52b7-e2d7-43d1-9dfb-6397f33a3052	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:25:41.691773
c864ae2c-0fd0-4805-a859-351ad5f5d65a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:25:41.718813
4e5066d8-81d2-4ca1-86dc-682e36378a86	\N	20398b85-b45e-4c65-8352-80107db982eb	update	user	a5ef1d1d-f6f7-41b2-a066-513d57120ab3	{"action": "updated user status", "isActive": false}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:25:43.166962
07094387-a79e-4302-8c29-cd78579ea662	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:25:43.225025
4c07e793-7afa-4f0d-b947-7e112f968737	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:25:43.259549
8f04c5ec-801c-4313-99ad-c1d925a8a4df	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:27:29.854696
4253785a-6d99-4a9c-8e84-5901be151555	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:27:29.891827
fd0558cd-6f3c-40a3-a872-37f0e77212c9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:27:31.182286
00f68d9c-d4bc-472e-a5fa-b1272542b2e2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:27:31.206644
96eacde1-b70d-4b1f-8dbd-24b1ce8af1e8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:27:31.276389
8c8aa177-fb79-4241-95a0-c31583d450c2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:27:31.302417
0f43ab09-bcec-4a2f-ad0e-91963f5becc0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:42:05.826407
836709f1-620c-4e01-8f7c-33f4e8dff7a8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 17:42:05.86238
f4b8f54d-e495-48c2-9bc8-dddf47a6b7cf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:15:03.722995
ddfe79f6-ed06-49b8-981b-9d7e2c4178cc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:15:03.761594
9a9ed394-351a-469a-bd74-d3893d20125a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:16:44.321731
51931982-8459-4138-b970-ae42caf64236	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:16:44.353818
ec469dd8-184a-403b-9d63-23c90ac5072f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:16:44.430911
f923bc77-ca02-4eac-be29-2a5a90575e4d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:16:44.459621
5723329a-8adb-4f78-938b-6363965d4c1b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:16:58.103829
9c8cb0d6-52c1-498e-bc13-6de5e0fafa6d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:16:58.127649
e83ae06d-952a-455e-9051-a75b0ca63c8d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:16:58.138396
d0b41f60-7674-4f2a-865b-4492a3f10668	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:16:58.158861
00ec7402-a6d1-4146-9c4c-5dc6707245a9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:17:00.068212
ecbc9b8d-4a57-4793-a430-867759f5a64b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:17:00.095222
e7a65047-fdc4-480f-b077-1962208ccaf7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:24:11.609385
bd770ffb-b282-4169-b3e1-539a408574c0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:24:11.691595
8dc7b278-d00e-4317-9485-fb101eeb0f4d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:24:15.775444
7c93a6df-88cf-4305-85c3-9ac08047da65	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:24:15.800897
a2afc32c-432d-4215-a878-cd64441ce972	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:24:15.975208
6b509e03-cd94-4706-b14b-803acf81a07d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:24:16.004382
2ac79d30-ca93-413e-9cda-78c6158e6940	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:29:08.699174
42795633-7c6d-4166-9f04-1f6f2db37c5b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:29:08.737511
edb8874c-6bfb-40c9-9517-1cf3cef3dcd4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:29:10.215774
8e293ca7-e604-4ae3-9b96-77b35830233d	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:29:10.237803
8c2de77c-08b1-42f8-a01d-4467f1ab0856	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:29:18.752519
672efc61-c800-421b-b4e6-2e3db26db222	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-22 18:29:18.77327
6ea36c01-7491-4a16-96dd-6dfb2fb2d74f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 10:02:31.474146
87767533-0725-4f22-8689-db6059621200	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 10:02:31.527324
cf048d9e-c903-4cb5-a02a-9449c56fc1d5	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 10:02:35.627266
c0389152-a343-4406-ae0e-bfd4037814fd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 10:02:35.649226
e48c1685-8d79-4835-8fe9-d332ac5c33ec	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 11:55:26.242865
311b0286-9407-4fe8-a1fe-6fc9284589f7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 11:55:26.30057
294d3008-4305-4a28-905c-f02d8696e985	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 11:57:28.499551
360ce7e4-ad9f-4473-82b1-6d2dcfbc10d7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 11:57:28.548529
87c1a48a-588e-44b4-9eb0-69c84d85e6e8	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 11:57:32.303614
500c8b2b-b18f-42a3-beaa-11953c28b52c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 11:57:32.328485
772be55e-6376-4514-a65b-b777fed8e16f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 11:57:33.345203
91a0704b-eef1-46e3-9fcb-7c2739e0064a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 11:57:33.386102
3d215631-0a33-44fa-bdca-e33952e49081	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 11:57:33.57628
074f2345-ed03-4a1a-a95a-4fd98e799c77	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 11:57:33.604232
7c0ca146-59ac-4a9c-bcbf-343791c998ea	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 11:57:34.366608
06628ca7-4491-42bc-82b5-ab2ea85dbe79	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 11:57:34.408694
eef9571d-26be-4a0e-8e99-ad10625b3dda	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:33:56.209277
a00c87d0-db70-426d-8b5b-572eda0f264f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:33:56.266492
8c595ff2-c792-4f18-8ce6-d699730f3166	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:14.484316
96e38107-b922-45ae-88e1-71318a2b7424	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:14.525542
99f25e57-68ef-4e95-ba70-895109089014	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:18.486536
c68efb4c-75fe-4f82-b841-6838f023813c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:18.511537
19f45184-999a-401f-a3aa-cd6b0451866b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:20.893517
078ea278-6e63-4359-83ae-6cfc54475380	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:20.936922
a1a08030-4eca-4005-8460-5012da815afe	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:22.344507
b3c2fc4f-b626-4f5a-a7c7-39c454efebe4	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:22.372767
b46df1ba-53c3-4750-bcd3-a4072c8f4450	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:47.783552
27d36854-6cf8-4bed-9689-aa3a4e3dd1ca	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:47.816031
169c54e6-2ad7-4b47-91d8-1fbb02518e48	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:51.994389
35915818-80a6-4367-a00a-b61ad79dddcb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:52.021967
63071168-e61f-4250-9f2c-dbcb24273b8c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:53.100747
567603a0-2f79-4900-a09f-25a0a41d0874	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:53.132341
366786b9-6ed4-478a-952c-ec5f9c3be1e2	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:54.321853
07a0c2ea-8e3c-40e3-bc7d-788d6af98f23	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:35:54.343483
b6401476-e655-4dfb-9757-36a3cd931446	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:37:58.481226
92d56730-283f-46f7-85a5-1b6af2679750	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:37:58.529248
2be9eb31-50ef-49b8-ad05-c583ff5e954f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:46:34.582145
2dd8afef-70d0-4839-be39-2642da1d6161	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:46:34.648185
9771d945-4edc-4c5b-a301-7dd29b4be33c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:46:37.999594
fa896208-d254-416b-bf09-05fe79aa3ddd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:46:38.024798
7d604817-3f40-4355-b5b0-55cc36a91827	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:46:39.131142
ca40e8e7-ed44-4f10-865e-fc52fb9f9dae	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:46:39.15908
47937312-7cb4-4593-a2fb-7c488a575b1b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:46:39.235653
9f92276e-c5af-42a8-b7c7-606052924a04	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 12:46:39.266646
edf229ff-6585-47da-a116-07cb07ed6f4c	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-23 13:15:52.98335
63b4d56b-121b-4a66-af15-0d1f09e48416	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-23 13:15:53.067383
9c777f47-5bf9-4d85-95f3-ed8622c4be11	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-23 13:19:44.814966
68f3734b-e709-47f2-8965-ba559f35fdfd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-23 13:19:47.8375
8e30ffb5-bdb7-4cd8-b813-446728f02d62	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-23 13:19:47.911885
269abd58-3bad-436c-9be3-1a588486fc03	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-23 13:21:23.005891
7b6a58eb-70c4-4770-8bb5-3dfce3d3867e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-23 13:21:23.055156
9a290b47-0265-4863-bd87-c101ca6cbe6b	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-23 13:21:25.640121
d0fde61d-49e0-4869-b7e0-a5bddbef9309	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-23 13:21:25.683272
87b8a909-0f14-46fe-a222-3471441e3854	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-23 13:22:14.504244
b8b6ef90-fab9-468f-b2b3-6aa2370f3b4e	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	2025-10-23 13:22:14.549668
5cb5be4a-c6a3-4b19-9f16-50780152a9fc	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:12:32.903589
c6901f9e-aca1-414a-83eb-81fb4cc4fa18	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:12:32.952306
feca6e87-5e01-44b4-9066-aab8ac549598	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:19:27.912667
fb9d5f04-198e-4039-ad14-c98dab4719a9	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:19:27.954441
b02af5af-909a-43b6-b155-f64781ba37f6	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:23:00.690419
2609ff9a-9973-40d8-8c91-c7749befccdf	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:23:27.753328
121974c1-c793-44a8-a5ee-6f28d15435ea	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:27:36.875257
2ead05ff-fb0c-4be2-8c8a-13c7ceb97633	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:27:44.878139
d31c8e83-7b3e-409f-9835-6d98b737f8ad	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:28:37.051509
8aebc438-208d-4e90-aff7-e4fe4147b5b1	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:39:54.243072
b23dce4e-e887-4f90-bc3c-99a239026776	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:39:54.876279
af897daa-8fcc-4cdb-b21b-f07740e747d0	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:39:54.8951
c6b0b820-00f7-40f1-a545-f00fc6467cea	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:39:55.399158
0025035b-e149-4456-8975-0b7399d5cc46	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:39:59.188992
a766b5a0-a7fd-4d8d-bc2a-19b7c58a2314	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:39:59.20867
af715b8c-6032-4abd-99d4-0792ca15f3fd	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:41:25.075428
cad6f947-a088-490a-b8f2-e5e573a9c901	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:41:32.745712
8ca0f61b-3df6-4afb-9d00-565b71279324	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:41:32.766314
aa2ffc6c-5d31-47f1-96ef-792035761bb7	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:41:33.385805
308fb5da-ab93-43b1-9182-eb3894305acb	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:41:36.767144
646be8ea-21a5-48be-89a3-8bde6e5e5218	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:41:37.60254
87f26a9e-5133-4a98-8f19-18ae406f9150	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:41:37.621688
79e8f81e-2772-4106-9511-9a86fc0c466f	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:41:39.955839
0a075abd-c757-4913-bddb-c2e069427220	\N	20398b85-b45e-4c65-8352-80107db982eb	login	user	multiple	{"action": "viewed users", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:41:41.144243
ccbbc534-4224-454a-b49a-2f47d0ff1964	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:41:41.164519
dec742de-a461-40f5-ad92-7896ae8daa0a	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:41:49.94821
2a6456ed-7fdd-4ae6-8b40-655fc86f1d30	\N	20398b85-b45e-4c65-8352-80107db982eb	login	system	dashboard	{"action": "viewed dashboard"}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:51:33.438105
db51d611-fb04-474d-8986-27542cbbc363	\N	20398b85-b45e-4c65-8352-80107db982eb	login	tenant	multiple	{"action": "viewed tenants", "filters": {"page": 1, "limit": 10, "sortBy": "createdAt", "sortOrder": "DESC"}}	::ffff:192.168.29.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	2025-10-23 15:54:06.6939
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, "createdAt", "updatedAt", "tenantId", name, description, "parentId", "isActive", "deletedAt") FROM stdin;
c0d2bc11-fe3f-4dce-8f1e-faefa15b907f	2025-09-17 13:31:20.827492+05:30	2025-09-17 13:31:20.827492+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Electronics	All electronic items	\N	t	\N
c63a6240-bbd8-419b-ba25-a602bd8eb69b	2025-09-17 13:31:20.827492+05:30	2025-09-17 13:31:20.827492+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Clothing	Apparel and garments	\N	t	\N
14bb8b3e-d750-4705-b214-21a9b7402f03	2025-09-17 13:31:20.827492+05:30	2025-09-17 13:31:20.827492+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Books	Books and stationery	\N	t	\N
a4847d37-6efd-43cb-92d9-520d42c291d5	2025-09-17 13:32:07.843009+05:30	2025-09-17 13:32:07.843009+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Mobile Phones	Smartphones and mobile devices	c0d2bc11-fe3f-4dce-8f1e-faefa15b907f	t	\N
8ca244c4-4312-4bbe-bd1d-5af2c844940e	2025-09-17 13:32:07.843009+05:30	2025-09-17 13:32:07.843009+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Laptops	Laptops and accessories	c0d2bc11-fe3f-4dce-8f1e-faefa15b907f	t	\N
c2c524f0-2cc9-4596-bc7a-46a732684f5f	2025-09-17 13:32:07.843009+05:30	2025-09-17 13:32:07.843009+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Men Clothing	Men apparel	c63a6240-bbd8-419b-ba25-a602bd8eb69b	t	\N
22ae5973-5a73-4917-a73a-e1b70b397346	2025-09-17 13:32:07.843009+05:30	2025-09-17 13:32:07.843009+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Women Clothing	Women apparel	c63a6240-bbd8-419b-ba25-a602bd8eb69b	t	\N
0007eb65-8484-4303-9d57-705644cc30b1	2025-09-17 13:32:07.843009+05:30	2025-09-17 13:32:07.843009+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Fiction	Fiction books	14bb8b3e-d750-4705-b214-21a9b7402f03	t	\N
400bfc02-26e8-433a-9399-51f2040ec1e0	2025-09-17 13:32:07.843009+05:30	2025-09-17 13:32:07.843009+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Non-fiction	Non-fiction books	14bb8b3e-d750-4705-b214-21a9b7402f03	t	\N
a44af56b-7e38-4998-adc6-d2f6c4d3ada8	2025-10-04 18:12:38.917224+05:30	2025-10-04 18:12:38.917224+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Stationary	Automatically created category for Stationary	\N	t	\N
86a54e38-a05f-425e-809d-cb897c416675	2025-10-04 18:17:59.516243+05:30	2025-10-04 18:17:59.516243+05:30	5485f417-e18a-4915-807e-168220a1a555	Computer Hardware	Automatically created category for Computer Hardware	\N	t	\N
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (id, name, email, phone, address, "taxId", "tenantId", "createdAt", "updatedAt") FROM stdin;
4a105275-423f-4c0d-9743-165e02fd3d58	Acme Corp	client@acme.com	9876543210	123 Market Street, City	TAX1234567	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	2025-09-10 16:24:13.068633	2025-09-10 16:24:13.068633
\.


--
-- Data for Name: credit_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credit_notes (id, tenant_id, credit_note_number, reason, status, original_invoice_id, amount, remaining_amount, currency, issue_date, notes, created_at) FROM stdin;
\.


--
-- Data for Name: credit_notes_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credit_notes_applications (id, credit_note_id, invoice_id, applied_amount, applied_at, applied_by) FROM stdin;
\.


--
-- Data for Name: customer_loyalty; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_loyalty (id, "createdAt", "updatedAt", "tenantId", "customerId", "programId", "totalPoints", "availablePoints", "totalCashbackEarned", "availableCashback", "totalAmountSpent", "totalOrders", "currentTier", "tierExpiryDate", "tierBenefits", "lastActivityDate", statistics) FROM stdin;
d89dceca-ee8c-4b6a-bdc0-27308772473d	2025-09-30 13:15:45.546644+05:30	2025-09-30 13:15:45.546644+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	b12305fa-8797-47ae-8277-7a9c1a6510ae	\N	0	0	NaN	NaN	129.60	1	bronze	2026-09-30 13:15:45.587	{}	2025-09-30 13:15:45.586	{}
6a33f1e4-fe07-459b-a9dd-57b91d52aafb	2025-09-30 14:46:48.145584+05:30	2025-09-30 14:46:48.145584+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	531c85c3-2498-4c25-8b28-9c6bac7adc20	\N	0	0	NaN	NaN	129.60	1	bronze	2026-09-30 14:46:48.208	{}	2025-09-30 14:46:48.208	{}
79ffd729-f136-463d-bfc5-175f8535a3b9	2025-09-30 15:25:55.576906+05:30	2025-09-30 15:25:55.576906+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	10456dd9-70b1-4a5c-9b46-44e4f93f6e8b	\N	0	0	NaN	NaN	129.60	1	bronze	2026-09-30 15:25:55.604	{}	2025-09-30 15:25:55.604	{}
29ba804a-e89b-4c2c-98a3-85ba805540ae	2025-10-03 16:28:12.840811+05:30	2025-10-03 19:05:18.129346+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	874ba8d4-56bb-4c5c-abae-f2e8efac5182	\N	0	0	0.00	0.00	0.00	5	bronze	2026-10-03 16:28:12.972	{}	2025-10-03 19:05:18.153	{}
0e57924b-47e6-4387-b9c7-cd760be04311	2025-10-08 11:32:00.27758+05:30	2025-10-08 11:32:06.020102+05:30	5485f417-e18a-4915-807e-168220a1a555	c25f0f4d-5959-4a15-8f55-c447c2f67577	\N	0	0	1050.00	1050.00	21000.00	2	bronze	\N	{}	2025-10-08 11:32:06.046	{}
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, "createdAt", "updatedAt", "tenantId", name, type, email, phone, "billingAddress", "shippingAddress", gstin, pan, "isActive", "creditBalance", metadata, "deletedAt") FROM stdin;
97a2b1b4-3f88-4e6a-9409-99df59487c7e	2025-10-08 09:58:00.934752+05:30	2025-10-08 09:58:00.934752+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Bijaya Mohanty	business	bijaya@gmail.com	9865321470	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAA0011A1Z5	\N	t	0.00	{}	\N
852d798c-8ef0-4fac-a20e-d4ba7394fe52	2025-09-18 17:22:14.411257+05:30	2025-09-18 17:22:14.411257+05:30	ddd4d7aa-6255-429e-a9dc-88a5ff501f4a	Rekha swain 	business	rekharani@gmail.com	9550099960	{"city": "jagatsinghapur", "line1": "tentoi ", "state": "odisha", "country": "India", "pincode": "754113"}	{"city": "jagatsinghapur", "line1": "tentoi ", "state": "odisha", "country": "India", "pincode": "754113"}	22AAAAA0000A1Z1	\N	t	0.00	{}	\N
b3962584-4947-42dd-87b4-dc929db1da34	2025-09-10 16:25:09.063245+05:30	2025-09-12 17:24:59.051352+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Srr Saumya	individual	john@example.com	9776236509	{"city": "London", "line1": "221B Baker Street", "line2": "", "state": "UK", "country": "UK", "pincode": "NW16XE"}	{"city": "London", "line1": "221B Baker Street", "line2": "", "state": "UK", "country": "UK", "pincode": "NW16XE"}	22AAAAA0000A1Z5	ABCDE1234F	t	0.00	{}	\N
580df0ad-1b19-4017-be1c-7568ddc3fd8f	2025-09-16 11:34:44.042113+05:30	2025-09-16 11:35:48.227068+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Monalisa Pradhan	business	monalisha@gmail.com	9663258741	\N	\N	22AAAAA0000A1Z7	\N	t	0.00	{}	\N
a364882d-b84d-4af5-a25c-d80369351627	2025-09-18 17:27:59.083436+05:30	2025-09-18 17:27:59.083436+05:30	54a2f4d8-15bd-4178-a330-3eceaa96e617	Rahul Mishra	business	rahulmishra@gmail.com	8529637410	{"city": "Noida", "line1": "Sector 22", "state": "Delhi", "country": "India", "pincode": "201020"}	{"city": "Noida", "line1": "Sector 22", "state": "Delhi", "country": "India", "pincode": "201020"}	22AAAAA0000A1Z0	\N	t	0.00	{}	\N
b12305fa-8797-47ae-8277-7a9c1a6510ae	2025-09-19 16:58:32.5037+05:30	2025-09-30 13:15:44.283066+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	saumya	business	saumyajiku229@gmail.com		{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}		\N	t	129.60	{}	2025-09-19 17:18:00.311
c45ab0e5-1051-43ea-90fd-f308f913c4f4	2025-09-18 17:30:42.356586+05:30	2025-09-18 17:30:42.356586+05:30	54a2f4d8-15bd-4178-a330-3eceaa96e617	Rahul Mishra	business	rahul@gmail.com	8529637410	{"city": "Noida", "line1": "Sector 22", "state": "Delhi", "country": "India", "pincode": "201020"}	{"city": "Noida", "line1": "Sector 22", "state": "Delhi", "country": "India", "pincode": "201020"}	22AAAAA0000A1Z0	\N	t	0.00	{}	\N
2d00ca55-fb6c-47c5-a9fc-7b0cddbc7044	2025-09-19 16:29:05.649735+05:30	2025-09-19 17:22:31.997233+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	babuli	business	babuli@gmail.com		{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}		\N	t	0.00	{}	2025-09-19 17:22:31.993
7aa2803c-ca07-4f9f-b0d6-5e624a18cea5	2025-09-18 18:15:00.664725+05:30	2025-09-18 18:18:29.559163+05:30	5485f417-e18a-4915-807e-168220a1a555	Monalisha 	business	monalisa@gmail.com	9556600999	{"city": "Bhubaneswar", "line1": "Bhubaneswar", "state": "Odisha", "country": "India", "pincode": "751015"}	{"city": "Bhubaneswar", "line1": "Bhubaneswar", "state": "Odisha", "country": "India", "pincode": "751015"}	22AAAAA0000A1Z9	\N	t	0.00	{}	\N
531c85c3-2498-4c25-8b28-9c6bac7adc20	2025-09-12 17:40:16.259187+05:30	2025-09-30 15:21:28.399698+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Rekha swain	business	rekhaswain123@gmail.com	09663258741	{"city": "jagatsinghapur", "line1": "Tentei", "line2": "", "state": "odisha", "country": "India", "pincode": "754110"}	{"city": "jagatsinghapur", "line1": "Tentei", "line2": "", "state": "odisha", "country": "India", "pincode": "754110"}	22AAAAA0000A1Z6	\N	t	129.60	{}	\N
78808bb7-bdbc-41f9-84e0-72e324c1c0be	2025-09-19 16:42:47.350596+05:30	2025-09-19 17:19:45.109062+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	kartik	business	kartik@gmail.com		{"city": "khorda", "line1": "chilika", "state": "odisha", "country": "India", "pincode": "754123"}	{"city": "khorda", "line1": "chilika", "state": "odisha", "country": "India", "pincode": "754123"}		\N	t	0.00	{}	2025-09-19 17:19:45.102
f464a077-ac60-4752-a807-67afb401d553	2025-09-19 16:27:49.289867+05:30	2025-09-19 17:26:30.030627+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	saumyadsgds	business	saumyajikdsfdfds@gmail.com		{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}		\N	t	0.00	{}	2025-09-19 17:26:30.024
e62c9ed5-080b-484b-974f-2420c8944930	2025-09-19 17:00:17.191534+05:30	2025-09-19 17:27:28.758862+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	ayush	business	ayush@gmail.com	9556556082	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAA1000A1Z5	\N	t	0.00	{}	2025-09-19 17:27:28.753
e1dfe38d-481f-489a-b6be-237e0f659996	2025-09-19 17:05:04.954527+05:30	2025-09-19 17:34:17.440887+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	ashwin	business	saumyarout229@gmail.com	9776236509	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}		\N	t	0.00	{}	2025-09-19 17:34:17.435
dd423551-7bbf-4ec4-a2b3-ebe37ae29582	2025-09-16 18:17:50.246231+05:30	2025-09-19 17:41:56.326821+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	chinmayee Padhi	business	chinamyee34@gmail.com	9663258798	{"city": "puri", "line1": "sdsaj", "state": "odisha", "country": "India", "pincode": "754110"}	{"city": "puri", "line1": "sdsaj", "state": "odisha", "country": "India", "pincode": "754110"}	22AAAAA0000A1Z3	\N	t	0.00	{}	2025-09-19 17:41:56.322
c81c6150-f3ff-487b-9c3e-db4826a0bae1	2025-09-19 18:27:38.700552+05:30	2025-09-19 18:27:38.700552+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	dkjhsdkj	business	asdfsd@gmail.com	9776236509	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}		\N	t	0.00	{}	\N
10456dd9-70b1-4a5c-9b46-44e4f93f6e8b	2025-09-30 15:25:54.308011+05:30	2025-09-30 15:27:39.310919+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	utam mohanty	business	utam@gmail.com	\N	\N	\N	\N	\N	t	129.60	{}	\N
21de7ab7-b330-431a-a4b4-a6627fd1964a	2025-09-16 17:07:46.774303+05:30	2025-09-22 18:15:53.750744+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Naliniprava Swain	business	naliniswain9@gmail.com	9853844598	{"city": "Cuttack", "line1": "mahanga", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "Cuttack", "line1": "mahanga", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAA0000A1Z0	\N	t	129.60	{}	\N
ea71e4ff-0407-4fec-bb92-969e8a7183f7	2025-09-19 17:55:13.861664+05:30	2025-09-20 16:07:17.654606+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	saumya	business	saumyajiku229@gmail.com	9776236509	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}		\N	t	0.00	{}	\N
874ba8d4-56bb-4c5c-abae-f2e8efac5182	2025-10-03 16:28:11.454975+05:30	2025-10-03 19:29:43.892577+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	sidhanta mahapatra	business	sidhanta@gmail.com	\N	\N	\N	\N	\N	t	129.60	{}	\N
b7f66a9a-bd0f-4619-8362-447a2cad766e	2025-10-03 19:31:05.305328+05:30	2025-10-03 19:31:05.32263+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	mihir das	business	mihir@gmail.com	\N	\N	\N	\N	\N	t	129.60	{}	\N
797606b1-9f49-430d-b26e-c80cb8cf3abe	2025-09-16 17:34:24.439265+05:30	2025-10-07 18:27:56.130725+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	saubhagya	business	saubhagyamiku229@gmail.com	7978577397	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "US", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "US", "pincode": "754108"}	22AAAAA0000A1Z6	\N	t	129.60	{}	\N
ab1162b6-5784-433d-928a-4b1eef780757	2025-10-08 10:15:14.440717+05:30	2025-10-08 10:15:14.440717+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Anubhav Mohanty	business	anubhav@gmail.com	7896541230	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAB1000A1Z5	\N	t	0.00	{}	\N
6322506a-bab9-4e29-a640-8e0fdefedb66	2025-10-08 10:22:13.909568+05:30	2025-10-08 10:22:13.909568+05:30	5485f417-e18a-4915-807e-168220a1a555	Manoj Jena	business	manoj@gmail.com	7856954123	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAB5000A1Z0	\N	t	0.00	{}	\N
4e3c657e-9c1b-468e-8448-f52e3055c93f	2025-10-08 10:30:18.564757+05:30	2025-10-08 10:30:18.564757+05:30	5485f417-e18a-4915-807e-168220a1a555	madhusudan Jena	business	madhusudan@gmail.com	7854210369	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAB4000A1Z0	\N	t	0.00	{}	\N
73507e1e-3e5d-4bd4-a718-d6701710f82e	2025-10-08 10:31:59.775427+05:30	2025-10-08 10:31:59.775427+05:30	5485f417-e18a-4915-807e-168220a1a555	aliva pradhan	business	aliva@gmail.com	9776236519	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAT5000A1Z0	\N	t	0.00	{}	\N
3612302f-9c15-4eb1-b6c2-c3b413a5f4ec	2025-10-08 10:32:54.559446+05:30	2025-10-08 10:32:54.559446+05:30	5485f417-e18a-4915-807e-168220a1a555	biswabandita moharana	business	biswabandita@gmail.com	9776236654	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAS4000A1Z0	\N	t	0.00	{}	\N
e063016e-44a2-4d0e-8359-e1918c74c3d1	2025-10-08 11:14:18.018165+05:30	2025-10-08 11:14:18.018165+05:30	5485f417-e18a-4915-807e-168220a1a555	Ratikant Pradhan	business	ratikant@gmail.com	8976543670	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAG5000A1Z7	\N	t	0.00	{}	\N
8b4d4f90-8b70-4607-b27c-cc0c08c04479	2025-10-08 11:20:42.246649+05:30	2025-10-08 11:21:02.233349+05:30	5485f417-e18a-4915-807e-168220a1a555	Ashwin Rout	business	ashwin@gmail.com	9556553258	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAR5600A1Z0	\N	t	0.00	{}	\N
361cc52b-4713-4230-99af-ec691ec01d53	2025-10-07 14:45:37.437401+05:30	2025-10-08 11:31:32.943164+05:30	5485f417-e18a-4915-807e-168220a1a555	Abhinash Pattnaik	business	abhinash@gmail.com	9778263519	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAA0000A1Z0	\N	t	189.00	{}	\N
c25f0f4d-5959-4a15-8f55-c447c2f67577	2025-10-08 11:20:03.105559+05:30	2025-10-08 11:32:03.934084+05:30	5485f417-e18a-4915-807e-168220a1a555	anup mohanty	business	anup@gmail.com	9856231470	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAF2000A1Z0	\N	t	10500.00	{}	\N
f6986283-c077-475e-9ba1-dc7695c3a76f	2025-10-17 11:06:49.236262+05:30	2025-10-17 11:07:04.640415+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Pintu Nandaee	business	pintu@gmail.com	8754213690	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAA0220A1Z5	\N	t	0.00	{}	2025-10-17 11:07:04.637
044a11df-c9b8-42e3-9e8d-b9dc50782435	2025-10-08 10:05:33.808636+05:30	2025-10-17 15:01:16.164623+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Sriram Panda	business	sriram@gmail.com	6532547890	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAA1200A1Z5	\N	t	0.00	{}	\N
ca37f200-97b6-4538-8aeb-1c82ceb6d559	2025-10-23 16:11:19.89331+05:30	2025-10-23 16:11:46.917804+05:30	59576a9e-070e-4439-be71-0e33c8bd4386	Rabindra Dass	business	rabindra@gmail.com	7896324512	{"city": "BHUBANESWER", "line1": "IRC VILLAGE", "state": "ODISHA", "country": "India", "pincode": "751015"}	{"city": "BHUBANESWER", "line1": "IRC VILLAGE", "state": "ODISHA", "country": "India", "pincode": "751015"}	22AAAAA0000A1Z5	\N	t	0.00	{}	2025-10-23 16:11:46.915
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (id, description, amount, category, "paymentMethod", "expenseDate", "referenceNumber", vendor, metadata, "tenantId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: gstins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gstins (id, gstin, legalname, tradename, address, statecode, isactive, isprimary, authstatus, "tenantId", "createdAt", "updatedAt") FROM stdin;
16	22AAAAA0000A1Z5	Demo Business Pvt Ltd	DemoBiz	{"city": "Mumbai", "line1": "HQ Road", "state": "MH", "country": "India", "pincode": "400001"}	27	t	t	{"status": "verified", "verifiedAt": "2025-09-10T10:00:00"}	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	2025-09-10 16:28:24.886155	2025-09-10 16:28:24.886155
\.


--
-- Data for Name: hsn_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hsn_codes (id, code, description, gstrate, cessrate, isactive, tenantid, createdat, updatedat) FROM stdin;
16	1001	Wheat and meslin	5.00	0.00	t	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	2025-09-10 16:29:34.21156	2025-09-10 16:29:34.21156
\.


--
-- Data for Name: invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice (id, "invoiceNumber", "clientName", amount, "dueDate", status, items, "tenantId", "gstinId", "customerId", "issueDate", type, total, "eInvoice", payment, "paymentHistory", "subscriptionId", "createdAt", "updatedAt") FROM stdin;
c1e984ec-7577-4e78-8d98-b16a2d582ac9	INV-1001	Acme Corp	1500.00	2025-09-30	issued	[{"qty": 2, "item": "Product A", "price": 500}, {"qty": 1, "item": "Product B", "price": 500}]	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	16	b3962584-4947-42dd-87b4-dc929db1da34	2025-09-11 16:31:53.615775	tax_invoice	1500.00	{"irn": "1234567890", "ackNo": "987654"}	{"method": "bank_transfer", "status": "completed"}	[{"date": "2025-09-10", "amount": 1500.00, "method": "bank_transfer"}]	\N	2025-09-12 10:34:34.341839+05:30	2025-09-12 10:34:34.341839+05:30
\.


--
-- Data for Name: invoice_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_items (quantity, metadata, "unitPrice", "taxRate", "taxAmount", "tenantId", "invoiceId", "productId", discount, "discountAmount", "lineTotal", "hsnId", id, "createdAt", "updatedAt", description, unit) FROM stdin;
2.00	\N	320.00	5.00	32.00	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	45688c06-91ee-43ed-a4a7-6dbf2d3d8084	68518bac-09c5-48a6-938c-5973627c91a4	0.00	0.00	672.00	\N	6ca815b6-f20b-4b73-9456-bf9a55e25415	2025-10-17 14:59:12.869267+05:30	2025-10-17 14:59:12.869267+05:30	Casio Calculator	pcs
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, "createdAt", "updatedAt", "tenantId", "invoiceNumber", type, status, "customerId", "issueDate", "dueDate", "paidDate", "paymentTerms", "shippingAddress", "billingAddress", "termsAndConditions", notes, "subTotal", "taxTotal", "discountTotal", "totalAmount", "amountPaid", "balanceDue", "discountDetails", "isRecurring", "recurringSettings", "sentAt", "viewedAt", "deletedAt", "gstinId", "subscriptionId", metadata) FROM stdin;
45688c06-91ee-43ed-a4a7-6dbf2d3d8084	2025-10-17 14:58:32.942131+05:30	2025-10-17 15:01:16.164623+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	INV-dae9-1760693313002-719	standard	draft	044a11df-c9b8-42e3-9e8d-b9dc50782435	2025-10-16	2025-10-31	\N	net_15	sangrampur	bhubaneswar	no return	ok	640.00	32.00	0.00	672.00	0.00	672.00	[]	f	\N	\N	\N	2025-10-17 15:01:16.244	\N	\N	\N
\.


--
-- Data for Name: loyalty_programs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loyalty_programs (id, "createdAt", "updatedAt", "tenantId", name, description, status, "rewardType", "cashbackPercentage", "minimumPurchaseAmount", "maximumCashbackAmount", "pointsPerUnit", "pointValue", "eligibilityCriteria", "redemptionRules", "isDefault") FROM stdin;
41190230-2e77-442f-834f-e28277b147ed	2025-09-26 10:34:05.479555+05:30	2025-09-26 10:34:05.479555+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Default Cashback Program	5% cashback on purchases above ₹10,000	active	cashback	5.00	10000.00	5000.00	\N	\N	{"minimumOrderValue": 10000}	{}	t
3051952c-8613-4c88-826f-6176dab36f10	2025-10-07 12:33:56.641658+05:30	2025-10-07 12:33:56.641658+05:30	5485f417-e18a-4915-807e-168220a1a555	Default Cashback Program	5% cashback on purchases above ₹10,000	active	cashback	5.00	10000.00	5000.00	\N	\N	{"minimumOrderValue": 10000}	{}	t
\.


--
-- Data for Name: loyalty_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loyalty_transactions (id, "createdAt", "updatedAt", "tenantId", "customerId", "invoiceId", "programId", type, status, points, "cashbackAmount", "orderAmount", description, "expiryDate", metadata, "effectivePercentage") FROM stdin;
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (id, title, body, data, "isRead", type, priority, "userId", "createdAt") FROM stdin;
e3bb8215-3de7-4c8e-b10d-dfd45ef127bf	Invoice Due Reminder	Your invoice INV-1001 is due on 2025-09-30.	{"amount": 1500.00, "invoiceId": "INV-1001"}	f	invoice_due	high	c3606aa6-7ce6-4b96-bb57-a4a3a7b0aed7	2025-09-10 16:34:50.789676
f4b730bc-74be-4db4-b84b-f26a727cbb06	Payment Received	We have received your payment of ?1500.00 for invoice INV-1001.	{"invoiceId": "INV-1001", "paymentMethod": "bank_transfer"}	f	payment_received	normal	c3606aa6-7ce6-4b96-bb57-a4a3a7b0aed7	2025-09-10 16:34:50.852065
\.


--
-- Data for Name: payment_methods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_methods (id, tenant_id, type, is_default, details, fingerprint, is_active, created_at, updated_at) FROM stdin;
ca7be62a-25b6-47d0-80be-1ee15ec8801d	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	card	t	{"brand": "visa", "last4": "4242", "exp_year": 2025, "exp_month": 12}	fingerprint_1	t	2025-09-11 15:14:52.349618+05:30	2025-09-11 15:14:52.349618+05:30
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, "createdAt", "updatedAt", "tenantId", amount, status, "subscriptionId", "gatewayResponse", "refundedAt", "userId", gateway, description, "paidAt", currency, "gatewayPaymentId", "gatewayOrderId") FROM stdin;
b1e04a54-a65f-4384-8e39-931fc839f601	2025-10-13 16:24:53.155927+05:30	2025-10-13 16:24:53.155927+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	999.00	pending	ce5885e8-a4d1-4c8f-80be-ec25b836050f	\N	\N	a1ac7272-dbda-4da5-b939-9b0ed8a12ebd	razorpay	Subscription payment for Weekly Plan	\N	INR	\N	\N
d92aa6b5-2d1e-4cef-945e-ebcab329b973	2025-10-17 10:00:36.075524+05:30	2025-10-17 10:00:36.075524+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	0.00	pending	b90ef3ef-12ca-4e59-808c-e2b012d4d61b	\N	\N	a1ac7272-dbda-4da5-b939-9b0ed8a12ebd	razorpay	Subscription payment for Free Plan	\N	INR	\N	\N
f92bb4fe-fad0-4ae9-a4a9-0e5fe6c2fd2a	2025-10-23 15:24:15.274656+05:30	2025-10-23 15:24:15.274656+05:30	5485f417-e18a-4915-807e-168220a1a555	0.00	pending	9e55f572-5605-4ef9-a419-9905b7e6658d	\N	\N	e55e49de-1358-43f5-a535-9fd593e72bf0	razorpay	Subscription payment for Free Plan	\N	INR	\N	\N
902b286c-cdde-4953-b0e0-83d2a80e5a4e	2025-10-23 16:03:55.340197+05:30	2025-10-23 16:03:55.340197+05:30	59576a9e-070e-4439-be71-0e33c8bd4386	0.00	pending	c4610d34-6ef2-4260-a88a-2d14b33352d2	\N	\N	92f32d52-611b-4136-a1fb-2364a09e523a	razorpay	Subscription payment for Free Plan	\N	INR	\N	\N
\.


--
-- Data for Name: payments_invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments_invoice (id, "createdAt", "updatedAt", "tenantId", "invoiceId", "customerId", amount, method, status, "paymentDate", "referenceNumber", notes, "paymentDetails", "deletedAt", "vendorId", "paymentType") FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, code, name, description, category, "createdAt", "updatedAt") FROM stdin;
b2a93aa3-5892-4361-b0a7-af96d20277f3	tenant:view	View Tenant	View tenant information	Tenant Management	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30
cf1dd7db-3692-4def-90e1-b3749a8a50d6	tenant:edit	Edit Tenant	Edit tenant information	Tenant Management	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30
c8b0ada2-340b-4872-926b-719b01830e3e	user:view	View Users	View users in the organization	User Management	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30
0e48f66b-b128-4cc4-9d9e-fcc8b82c3053	user:create	Create Users	Create new users	User Management	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30
49c75c64-f7e4-490b-b405-f3dad353eddc	user:edit	Edit Users	Edit existing users	User Management	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30
0167070f-4619-4e56-8e17-17e354222733	subscription:view	View Subscription	View subscription details	Subscription Management	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30
adaf5a8b-7050-4971-9e80-66b8b27e9389	subscription:change	Change Subscription	Request subscription changes	Subscription Management	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30
906087fa-4770-4fae-a12e-1c1271662a58	invoice:view	View Invoices	View and download invoices	Billing	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30
3b000d15-0490-493d-ae80-92decd0118b7	invoice:pay	Pay Invoices	Pay outstanding invoices	Billing	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30
67c77158-dbad-46ae-9e76-35da8add7bc0	payment_method:manage	Manage Payment Methods	Add/edit payment methods	Billing	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30
4d2c77af-c430-4db4-98bd-3db00226e718	usage:view	View Usage	View usage metrics	Usage	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30
\.


--
-- Data for Name: plan_features; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_features (id, plan_id, code, name, description, value, sort_order, "createdAt", "updatedAt", "planId") FROM stdin;
4fab9d62-fcb8-4108-ba35-38615666fd82	95be88e0-76f9-489f-b55c-16a86dfbd92f	users	Users	Number of users included	10	1	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30	\N
039a894e-3c3c-48ac-8dfe-59605eb36072	95be88e0-76f9-489f-b55c-16a86dfbd92f	storage	Storage	Storage space included (GB)	100	2	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30	\N
90a53422-379a-456d-87ad-4bb094b3f919	95be88e0-76f9-489f-b55c-16a86dfbd92f	support	Support	Support level	priority	3	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30	\N
cef7c2a7-f023-4e43-9bb0-5acc2e8aa2e8	95be88e0-76f9-489f-b55c-16a86dfbd92f	api_calls	API Calls	Monthly API calls included	10000	4	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30	\N
ce954e12-8311-4df2-84ee-972d4411ce36	fd15a66e-eb85-4f73-ac2e-1457a38861cb	users	Users	Number of users included	3	1	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30	\N
71ecf7d3-6fc0-42f7-b35a-a5590c24850f	fd15a66e-eb85-4f73-ac2e-1457a38861cb	storage	Storage	Storage space included (GB)	10	2	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30	\N
1d942df6-0a0b-4869-a60f-f1423af8981f	fd15a66e-eb85-4f73-ac2e-1457a38861cb	support	Support	Support level	standard	3	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30	\N
8123e977-5627-4352-8f09-5b7ebf352279	fd15a66e-eb85-4f73-ac2e-1457a38861cb	api_calls	API Calls	Monthly API calls included	1000	4	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30	\N
\.


--
-- Data for Name: plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plans (id, name, description, price, "createdAt", "updatedAt", price_currency, billing_interval, trial_period_days, is_active) FROM stdin;
95be88e0-76f9-489f-b55c-16a86dfbd92f	Pro Monthly	Professional plan with priority support	49.99	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30	USD	month	0	t
fd15a66e-eb85-4f73-ac2e-1457a38861cb	Starter Monthly	Starter plan for small teams	9.99	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30	USD	month	0	t
\.


--
-- Data for Name: product_tax_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_tax_rates (tax_rate_id, product_id) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (description, type, metadata, "tenantId", id, "createdAt", "updatedAt", "hsnCode", "costPrice", "sellingPrice", "stockQuantity", "lowStockThreshold", "stockStatus", unit, "taxRate", "categoryId", images, "isActive", "deletedAt", "hsnId", name, sku) FROM stdin;
Smart Phone	goods	{}	54a2f4d8-15bd-4178-a330-3eceaa96e617	301702af-77df-44f4-aa25-dfb3953983bd	2025-09-18 17:59:21.725297+05:30	2025-09-18 17:59:21.725297+05:30	8517	25000.00	30000.00	48.00	10.00	in_stock	units	18.00	\N	\N	t	\N	\N	Real me Narzo 15	RM-NZ15X-6-128-BLU
ok	service	{}	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	3e3b3403-ba9b-4dcb-a14a-96eea498ad64	2025-09-20 10:40:46.951679+05:30	2025-09-20 12:30:20.064958+05:30	ghj	10.00	20.00	0.00	0.00	out_of_stock	pcs	0.00	14bb8b3e-d750-4705-b214-21a9b7402f03	\N	t	2025-09-20 12:30:20.06	\N	almond	asdasdw
ok	service	{}	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	5b7e6fd2-e59e-48a4-bb42-1a8326b1013b	2025-09-17 13:20:46.10514+05:30	2025-09-20 12:31:22.206837+05:30	ghj	100.00	120.00	0.00	0.00	out_of_stock	23	8.00	400bfc02-26e8-433a-9399-51f2040ec1e0	\N	t	\N	\N	cashews	asdasd
Student Utility	goods	{}	5485f417-e18a-4915-807e-168220a1a555	ce2921f7-c6cc-4787-b70f-64bd68b4af1d	2025-10-04 18:17:59.535969+05:30	2025-10-04 18:17:59.535969+05:30	12358	150.00	250.00	30.00	5.00	in_stock	pcs	8.00	86a54e38-a05f-425e-809d-cb897c416675	\N	t	\N	\N	Keyboard	78945
Student Utility	goods	{}	5485f417-e18a-4915-807e-168220a1a555	9da3d568-30d2-4cc3-bbf1-8b5a2c4c4790	2025-10-07 11:38:18.893383+05:30	2025-10-07 11:39:36.642276+05:30	123582	6000.00	8000.00	25.00	5.00	in_stock	pcs	5.00	86a54e38-a05f-425e-809d-cb897c416675	\N	t	\N	\N	Monitor	978532
Student Utility	goods	{}	5485f417-e18a-4915-807e-168220a1a555	4fa5dbe1-7238-4a17-9f20-b4c3b572450b	2025-10-07 11:10:47.520496+05:30	2025-10-08 11:31:32.943164+05:30	334673	100.00	180.00	23.00	5.00	in_stock	pcs	5.00	86a54e38-a05f-425e-809d-cb897c416675	\N	t	\N	\N	mouse	978534
Student Utility	goods	{}	5485f417-e18a-4915-807e-168220a1a555	d63a4d5c-aebe-47ec-a043-25a984e92c33	2025-10-08 11:30:12.552201+05:30	2025-10-08 11:32:03.934084+05:30	123532	2000.00	5000.00	19.00	6.00	in_stock	pcs	5.00	86a54e38-a05f-425e-809d-cb897c416675	\N	t	\N	\N	Harddisk	978522
Student Utility	goods	{}	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	474765d6-ffbe-4aa9-8a61-63fa5f3ab2a2	2025-10-17 11:58:04.405407+05:30	2025-10-17 12:02:29.130369+05:30	56787	1550.00	2820.00	65.00	5.00	in_stock	pcs	10.00	8ca244c4-4312-4bbe-bd1d-5af2c844940e	\N	t	2025-10-17 12:02:29.128	\N	Mobile Charger	98766
Student Utility	goods	{}	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	68518bac-09c5-48a6-938c-5973627c91a4	2025-10-04 18:12:39.051909+05:30	2025-10-17 14:59:12.869267+05:30	5678	120.00	320.00	16.00	5.00	in_stock	pcs	5.00	a44af56b-7e38-4998-adc6-d2f6c4d3ada8	\N	t	\N	\N	Casio Calculator	98765
\.


--
-- Data for Name: professional_tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professional_tenants (id, "professionalId", "tenantId", "specificPermissions", "isActive", "assignedAt") FROM stdin;
\.


--
-- Data for Name: professional_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professional_user (id, "createdAt", "updatedAt", "userId", "professionalType", "firmName", "professionalLicenseNumber", phone, address, "isActive", permissions) FROM stdin;
\.


--
-- Data for Name: professional_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professional_users (id, "createdAt", "updatedAt", "userId", "professionalType", "firmName", "professionalLicenseNumber", address, phone, "isActive", permissions) FROM stdin;
\.


--
-- Data for Name: purchase_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_items (id, "createdAt", "updatedAt", "tenantId", "purchaseOrderId", "productId", description, quantity, unit, "unitPrice", discount, "discountAmount", "taxRate", "taxAmount", "lineTotal", "receivedQuantity", "isReceived") FROM stdin;
340b6bf5-38ac-42be-b3df-54c64312d38c	2025-09-17 17:26:37.197168+05:30	2025-09-17 17:26:37.197168+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	82281a5a-b5f8-4d56-8dda-d3b4953259ba	5b7e6fd2-e59e-48a4-bb42-1a8326b1013b	cashews	1.00	23	100.00	10.00	10.00	8.00	7.20	97.20	0.00	f
27ed6ae3-4370-4713-b18b-6615ec8b4e0e	2025-09-19 11:00:37.01889+05:30	2025-09-19 11:00:37.01889+05:30	54a2f4d8-15bd-4178-a330-3eceaa96e617	f0006b65-afb2-4520-90fb-f2feee0393b6	301702af-77df-44f4-aa25-dfb3953983bd	Real me Narzo 15	10.00	units	25000.00	5.00	12500.00	18.00	42750.00	280250.00	0.00	f
eece63a3-d03c-407a-858c-a86d3f2179a2	2025-09-20 15:10:11.4381+05:30	2025-09-20 15:10:11.4381+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	86626beb-bfc4-4782-abc9-52c8137186ef	5b7e6fd2-e59e-48a4-bb42-1a8326b1013b	cashews	1.00	23	100.00	10.00	10.00	8.00	7.20	97.20	0.00	f
4f93532e-a692-4b98-b15d-84b58bca9dd3	2025-09-20 15:10:11.4381+05:30	2025-09-20 15:10:11.4381+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	86626beb-bfc4-4782-abc9-52c8137186ef	5b7e6fd2-e59e-48a4-bb42-1a8326b1013b	cashews	1.00	23	100.00	8.00	8.00	8.00	7.36	99.36	0.00	f
6c8f1880-ba14-435a-8be8-64a2947e54eb	2025-09-17 14:55:08.142716+05:30	2025-09-23 15:46:37.239084+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	9b8f9b74-5390-4079-9d94-d1eee98086ae	\N	cashews	1.00	23	100.00	0.00	0.00	8.00	8.00	108.00	0.00	f
e7449952-9538-4472-bf32-928dd584105b	2025-10-08 11:30:58.129842+05:30	2025-10-08 11:30:58.129842+05:30	5485f417-e18a-4915-807e-168220a1a555	cc4f6820-502b-46a1-971f-c1bb27906606	d63a4d5c-aebe-47ec-a043-25a984e92c33	Harddisk	1.00	pcs	2000.00	0.00	0.00	5.00	100.00	2100.00	0.00	f
54a155c0-d20d-4047-b7e7-57dcd578f69b	2025-10-17 12:27:52.88731+05:30	2025-10-17 12:27:52.88731+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	f44bee65-b297-427e-8c77-96c658c90c59	68518bac-09c5-48a6-938c-5973627c91a4	Casio Calculator	1.00	pcs	120.00	0.00	0.00	5.00	6.00	126.00	0.00	f
\.


--
-- Data for Name: purchase_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order (id, "tenantId", "vendorId", "poNumber", "orderDate", "expectedDeliveryDate", "deliveryAddress", notes, subtotal, "taxAmount", "totalAmount", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: purchase_order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_item (id, "purchaseOrderId", "itemName", description, quantity, unit, "unitPrice", "taxRate", amount) FROM stdin;
\.


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_orders (id, "createdAt", "updatedAt", "tenantId", "poNumber", status, type, "vendorId", "orderDate", "expectedDeliveryDate", "actualDeliveryDate", "shippingAddress", "billingAddress", "termsAndConditions", notes, "subTotal", "taxTotal", "discountTotal", "totalAmount", "amountPaid", "balanceDue", "taxDetails", "deletedAt") FROM stdin;
f0006b65-afb2-4520-90fb-f2feee0393b6	2025-09-18 18:16:15.738796+05:30	2025-09-19 11:00:37.01889+05:30	54a2f4d8-15bd-4178-a330-3eceaa96e617	PO-e617-1758199575842-848	draft	product	2d81403d-00e6-4725-a4a0-6c8547a17895	2025-09-18	2025-10-24	\N	Nayapalli	Bhubaneswar	All products are sold under manufacturer warranty and once sold, goods cannot be returned or exchanged.	Read the T&C carefully.	250000.00	42750.00	12500.00	280250.00	0.00	280250.00	[{"taxName": "Tax 18%", "taxRate": 18, "taxAmount": 42750}]	\N
86626beb-bfc4-4782-abc9-52c8137186ef	2025-09-20 15:09:01.103962+05:30	2025-09-20 15:10:11.4381+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	PO-dae9-1758361141195-301	draft	product	f651c95e-df21-4c77-8df3-2a1b75ada149	2025-09-20	\N	\N	sangrampur				200.00	14.56	18.00	196.56	0.00	196.56	[{"taxName": "Tax 8%", "taxRate": 8, "taxAmount": 14.56}]	\N
82281a5a-b5f8-4d56-8dda-d3b4953259ba	2025-09-17 14:47:57.472433+05:30	2025-09-20 15:14:45.894603+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	PO-dae9-1758100677572-42	draft	product	f651c95e-df21-4c77-8df3-2a1b75ada149	2025-09-17	2025-09-20	\N	sangrampur	bhubaneswar	no return	ok	100.00	7.20	10.00	97.20	0.00	97.20	[{"taxName": "Tax 8%", "taxRate": 8, "taxAmount": 7.2}]	2025-09-20 15:14:45.884
9b8f9b74-5390-4079-9d94-d1eee98086ae	2025-09-17 14:55:08.142716+05:30	2025-09-23 15:46:37.239084+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	PO-dae9-1758101108251-579	draft	service	f651c95e-df21-4c77-8df3-2a1b75ada149	2025-09-17	\N	\N	sangrampur	edfw	no return	werfqwre	100.00	8.00	0.00	108.00	0.00	108.00	[{"taxName": "Tax 8%", "taxRate": 8, "taxAmount": 8}]	2025-09-23 15:46:37.225
cc4f6820-502b-46a1-971f-c1bb27906606	2025-10-08 11:30:50.154602+05:30	2025-10-08 11:30:58.129842+05:30	5485f417-e18a-4915-807e-168220a1a555	PO-a555-1759903250257-861	draft	product	0bde0d95-5bf3-4f7a-9b5c-cc970cbcfe62	2025-10-08	\N	\N	sangrampur	bhubaneswar	no return	okk	2000.00	100.00	0.00	2100.00	0.00	2100.00	[{"taxName": "Tax 5%", "taxRate": 5, "taxAmount": 100}]	\N
f44bee65-b297-427e-8c77-96c658c90c59	2025-10-17 12:27:22.617051+05:30	2025-10-17 12:28:00.850962+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	PO-dae9-1760684242669-852	draft	product	f651c95e-df21-4c77-8df3-2a1b75ada149	2025-10-17	2025-10-24	\N	sangrampur	bhubaneswar	no return	okkh	120.00	6.00	0.00	126.00	0.00	126.00	[{"taxName": "Tax 5%", "taxRate": 5, "taxAmount": 6}]	2025-10-17 12:28:00.846
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reports (id, "createdAt", "updatedAt", "tenantId", name, type, format, status, parameters, filters, "filePath", "recordCount", "generatedAt", "errorMessage") FROM stdin;
6b417794-5f9b-40e8-83cb-83a4fec228b5	2025-09-24 10:58:45.98933+05:30	2025-09-24 10:58:46.227692+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	completed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-09-24T05-28-46-091Z.xlsx	5	2025-09-24 10:58:46.218	\N
186cd720-da66-48fa-9e69-b8a80616ecc9	2025-09-24 10:59:19.912748+05:30	2025-09-24 10:59:19.985207+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	completed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-09-24T05-29-19-940Z.xlsx	5	2025-09-24 10:59:19.981	\N
26759181-76f7-4fe9-bea6-878ce3fbcc1e	2025-09-24 11:00:18.376556+05:30	2025-09-24 11:00:18.425815+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	completed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-09-24T05-30-18-402Z.xlsx	5	2025-09-24 11:00:18.421	\N
8a049377-0b1a-488f-86d8-b74d92ccc6a6	2025-09-24 12:07:41.110909+05:30	2025-09-24 12:07:41.168219+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	completed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-09-24T06-37-41-138Z.xlsx	5	2025-09-24 12:07:41.164	\N
62ba7423-4ac8-4807-88ec-354fd7cc5966	2025-09-24 12:19:05.039236+05:30	2025-09-24 12:19:05.086693+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	completed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-09-24T06-49-05-064Z.xlsx	5	2025-09-24 12:19:05.082	\N
f94a4fcd-e90f-4303-9a09-b8c4f84c5581	2025-09-24 12:19:10.044601+05:30	2025-09-24 12:19:10.072866+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	completed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-09-24T06-49-10-054Z.xlsx	5	2025-09-24 12:19:10.07	\N
985d5adb-d040-43ab-8726-5631293cfd7f	2025-09-24 12:19:18.645576+05:30	2025-09-24 12:19:18.670957+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	completed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-09-24T06-49-18-654Z.xlsx	5	2025-09-24 12:19:18.667	\N
921866bb-c315-4fdf-a69d-ede4b6da056c	2025-09-24 12:23:35.589646+05:30	2025-09-24 12:23:35.648142+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-3B Summary Report	gstr3b_summary	excel	completed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr3b_summary_2025-09-24T06-53-35-631Z.xlsx	4	2025-09-24 12:23:35.643	\N
a95afe0d-9eaa-45e3-8827-e2af38b5562e	2025-09-24 12:23:43.418881+05:30	2025-09-24 12:23:43.463662+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Sales Register Report	sales_register	excel	completed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\sales_register_2025-09-24T06-53-43-434Z.xlsx	2	2025-09-24 12:23:43.459	\N
2853f94b-a2e8-4627-9c5e-128742c03b50	2025-09-24 12:23:51.698923+05:30	2025-09-24 12:23:51.727642+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Purchase Register Report	purchase_register	excel	completed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\purchase_register_2025-09-24T06-53-51-708Z.xlsx	2	2025-09-24 12:23:51.724	\N
f83770c0-7a31-4f64-a355-0def5464212b	2025-09-24 12:23:58.155421+05:30	2025-09-24 12:23:58.184368+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	HSN/SAC Wise Summary Report	hsn_summary	excel	completed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\hsn_summary_2025-09-24T06-53-58-165Z.xlsx	3	2025-09-24 12:23:58.18	\N
a829fe5a-2b53-45a1-88f8-683d952d9c0f	2025-09-24 12:24:06.761324+05:30	2025-09-24 12:24:06.788979+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	TDS Report	tds_report	excel	completed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\tds_report_2025-09-24T06-54-06-769Z.xlsx	0	2025-09-24 12:24:06.785	\N
1057699c-c947-455e-91a2-8df93d49ff20	2025-09-24 12:24:12.316355+05:30	2025-09-24 12:24:12.406794+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Audit Trail Report	audit_trail	excel	failed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	\N	\N	\N	No metadata for "AuditLog" was found.
45173dd1-ed59-42ff-8ebe-0e5c0d1dc5a1	2025-09-24 12:24:26.120428+05:30	2025-09-24 12:24:26.142901+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Audit Trail Report	audit_trail	excel	failed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	\N	\N	\N	No metadata for "AuditLog" was found.
0a6a25e9-ce1f-4753-a4e6-ffda6c1b80aa	2025-09-24 15:33:51.743111+05:30	2025-09-24 15:33:51.933571+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	pdf	completed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-09-24T10-03-51-785Z.pdf	5	2025-09-24 15:33:51.93	\N
ee6b01f9-06f7-41c3-a5b0-f8140bb4df31	2025-09-24 15:34:24.373726+05:30	2025-09-24 15:34:24.403623+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	csv	completed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-09-24T10-04-24-396Z.csv	5	2025-09-24 15:34:24.398	\N
0c880351-5684-4de3-a9a0-daf27d37aab3	2025-09-24 15:34:40.425384+05:30	2025-09-24 15:34:40.455824+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	csv	completed	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	{"toDate": "2025-09-24", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-09-24T10-04-40-449Z.csv	5	2025-09-24 15:34:40.451	\N
7ddb6d3f-fe2c-4a0a-b85b-3c3ef7614d25	2025-09-25 11:25:17.43495+05:30	2025-09-25 11:25:17.642884+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Purchase Register Report	purchase_register	json	completed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\purchase_register_2025-09-25T05-55-17-634Z.json	1	2025-09-25 11:25:17.636	\N
072c191f-2a98-4d87-bd73-13fc7a8a1938	2025-09-25 11:25:46.801561+05:30	2025-09-25 11:25:46.82654+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Audit Trail Report	audit_trail	json	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	No metadata for "AuditLog" was found.
e8e0bd58-3c71-4411-88b8-4780e69d36fb	2025-09-25 11:38:00.61384+05:30	2025-09-25 11:38:01.134968+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Audit Trail Report	audit_trail	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Worksheet name already exists: Summary
7e2331c2-1fa8-4015-b679-53707374248e	2025-09-25 11:49:28.744857+05:30	2025-09-25 11:49:28.911458+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	TDS Report	tds_report	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Worksheet name already exists: Summary
5c11a1c1-0371-4aaf-b80a-9c884c0723ed	2025-09-25 12:00:16.664733+05:30	2025-09-25 12:00:16.746708+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
8017ac35-192d-4d3b-805b-dd9f6b5ce81e	2025-09-25 12:00:27.012138+05:30	2025-09-25 12:00:27.036538+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-3B Summary Report	gstr3b_summary	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
a5fba72b-db6f-4a92-9fbc-54238aa0b3aa	2025-09-25 12:00:34.782009+05:30	2025-09-25 12:00:34.795788+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Sales Register Report	sales_register	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
4210f1dc-7abc-4ab6-adb9-835176d4d085	2025-09-25 12:00:45.284976+05:30	2025-09-25 12:00:45.313903+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Purchase Register Report	purchase_register	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Worksheet name already exists: Summary
79127d8f-6020-4ed4-9f5f-e4e8afd919a0	2025-09-25 12:01:24.595871+05:30	2025-09-25 12:01:24.628436+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	HSN/SAC Wise Summary Report	hsn_summary	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Worksheet name already exists: Summary
35c468f9-a5cb-4a95-995f-fe8e279741b8	2025-09-25 12:01:31.596988+05:30	2025-09-25 12:01:31.616595+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	TDS Report	tds_report	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Worksheet name already exists: Summary
6e66fcde-fc8f-4bee-97af-6cdc25b9aadb	2025-09-25 12:01:39.221134+05:30	2025-09-25 12:01:39.243211+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Audit Trail Report	audit_trail	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Worksheet name already exists: Summary
1a1590d0-0fa0-4872-a34a-df648469ee54	2025-09-25 12:01:49.071021+05:30	2025-09-25 12:01:49.143053+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Audit Trail Report	audit_trail	pdf	completed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\audit_trail_2025-09-25T06-31-49-079Z.pdf	1	2025-09-25 12:01:49.14	\N
f52360b4-45cb-4908-a7dd-a9c88185b498	2025-09-25 12:02:04.924333+05:30	2025-09-25 12:02:04.950456+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	csv	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
bccd39f9-d6f9-48a5-8251-b2b616995b8a	2025-09-25 12:02:16.793026+05:30	2025-09-25 12:02:16.814725+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	json	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
a6da5f61-d4a8-46f9-a27b-a90aa6fee2d9	2025-09-25 12:02:28.766034+05:30	2025-09-25 12:02:28.788874+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
34b84961-fe97-4b1e-8ee0-c7937ff64c7d	2025-09-25 12:07:58.011113+05:30	2025-09-25 12:07:58.104397+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
933a2f58-9e07-427a-9711-c44c0c259975	2025-09-25 12:08:06.740142+05:30	2025-09-25 12:08:06.75772+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	pdf	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
cb54b73b-c90b-452c-973a-64b10571f42b	2025-09-25 12:10:11.421416+05:30	2025-09-25 12:10:11.492815+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
df68eaf8-e535-4936-a10e-ceaadeb2bbfb	2025-09-25 12:10:19.116073+05:30	2025-09-25 12:10:19.13013+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	pdf	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
d0ff626d-6b2c-4f3f-a664-95a19b3504b3	2025-09-25 12:10:27.211552+05:30	2025-09-25 12:10:27.230163+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	csv	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
54c08079-92e9-479b-9166-53316732df77	2025-09-25 12:10:33.306068+05:30	2025-09-25 12:10:33.321731+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	json	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
74d9a582-584a-4473-846b-aa7cee20a4e3	2025-09-25 12:10:41.01077+05:30	2025-09-25 12:10:41.027334+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-3B Summary Report	gstr3b_summary	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
f4d0426a-446a-44c3-85dc-005665b19eae	2025-09-25 12:10:48.170317+05:30	2025-09-25 12:10:48.183869+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-3B Summary Report	gstr3b_summary	pdf	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
bef08b1d-b3a5-487a-9a0b-ba8a15b72aae	2025-09-25 12:10:58.826335+05:30	2025-09-25 12:10:58.849884+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-3B Summary Report	gstr3b_summary	csv	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
8b61c80f-8669-454d-a8a0-b4dd83053381	2025-09-25 12:11:22.696177+05:30	2025-09-25 12:11:22.718068+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-3B Summary Report	gstr3b_summary	json	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
a1fcbbff-d40f-40e6-a547-62658053f3eb	2025-09-25 12:11:30.946227+05:30	2025-09-25 12:11:30.961189+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Sales Register Report	sales_register	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
febd5b09-500e-4205-b677-7336403355e2	2025-09-25 12:11:39.121217+05:30	2025-09-25 12:11:39.135449+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Sales Register Report	sales_register	pdf	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
b5061521-6e96-4f05-8c0e-e96c6d784d2d	2025-09-25 12:20:53.581775+05:30	2025-09-25 12:20:53.648692+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
dca807a7-374f-4323-9cb8-3145cc624484	2025-09-25 12:34:29.017082+05:30	2025-09-25 12:34:29.114381+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
838f9359-67fa-4b70-8161-62b6b3749e2e	2025-09-25 12:37:26.429344+05:30	2025-09-25 12:37:26.507076+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
f2f8a72e-f237-42ea-ae10-0c53fd16320f	2025-09-25 12:44:07.822536+05:30	2025-09-25 12:44:07.896395+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
847c8507-acee-4df7-bdf7-d805ad6c5d30	2025-09-25 12:54:48.555313+05:30	2025-09-25 12:54:48.630435+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Property "taxDetails" was not found in "Invoice". Make sure your query is correct.
e64b84c3-27f3-4d0d-a591-a847e84cfb3c	2025-09-25 13:01:49.809012+05:30	2025-09-25 13:01:49.947308+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Worksheet name already exists: Summary
27ce3f6c-bf9e-45a4-b35b-f781022bd2eb	2025-09-25 13:27:10.137955+05:30	2025-09-25 13:27:10.227082+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	failed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	\N	\N	\N	Worksheet name already exists: Summary
19168c8a-fee3-495a-9d7f-49afbe0cf2ba	2025-09-25 13:35:28.622328+05:30	2025-09-25 13:35:28.863665+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	completed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-09-25T08-05-28-716Z.xlsx	1	2025-09-25 13:35:28.854	\N
93a56b9c-7c35-4382-a78f-5991321abce9	2025-09-25 13:35:37.719848+05:30	2025-09-25 13:35:37.827827+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	pdf	completed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-09-25T08-05-37-731Z.pdf	1	2025-09-25 13:35:37.824	\N
bba0bd5d-995d-413e-89ff-31aec37c4cd7	2025-09-25 13:35:43.348594+05:30	2025-09-25 13:35:43.364997+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	csv	completed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-09-25T08-05-43-359Z.csv	1	2025-09-25 13:35:43.361	\N
25ef94dd-548b-4b1c-bc50-f9e62a9a1e79	2025-09-25 13:35:47.976014+05:30	2025-09-25 13:35:47.992693+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	json	completed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-09-25T08-05-47-987Z.json	1	2025-09-25 13:35:47.989	\N
46cdb37e-8a47-429f-be3b-789c75eb17cb	2025-09-25 13:35:53.612913+05:30	2025-09-25 13:35:53.65878+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Audit Trail Report	audit_trail	excel	completed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\audit_trail_2025-09-25T08-05-53-626Z.xlsx	1	2025-09-25 13:35:53.654	\N
0821af48-f1d3-4e43-86bd-bcc630ad40cc	2025-09-25 14:35:01.754908+05:30	2025-09-25 14:35:02.05225+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	TDS Report	tds_report	excel	completed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\tds_report_2025-09-25T09-05-01-903Z.xlsx	1	2025-09-25 14:35:02.048	\N
8e2e8419-dcea-420e-befa-b582a66fe333	2025-09-25 18:12:28.768182+05:30	2025-09-25 18:12:28.955922+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	HSN/SAC Wise Summary Report	hsn_summary	json	completed	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	{"toDate": "2025-09-25", "fromDate": "2025-08-31"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\hsn_summary_2025-09-25T12-42-28-948Z.json	1	2025-09-25 18:12:28.951	\N
5a908789-d2e5-4aef-b12d-e333ea52acbf	2025-10-03 13:26:51.953418+05:30	2025-10-03 13:26:52.343277+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	completed	{"toDate": "2025-10-03", "fromDate": "2025-09-04"}	{"toDate": "2025-10-03", "fromDate": "2025-09-04"}	E:\\billingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-10-03T07-56-52-180Z.xlsx	1	2025-10-03 13:26:52.32	\N
dac1d0c6-fc2b-4ceb-8ec1-14a676c79895	2025-10-08 18:31:35.304318+05:30	2025-10-08 18:31:35.467882+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	HSN/SAC Wise Summary Report	hsn_summary	excel	completed	{"toDate": "2025-10-08", "fromDate": "2025-09-30"}	{"toDate": "2025-10-08", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\hsn_summary_2025-10-08T13-01-35-337Z.xlsx	1	2025-10-08 18:31:35.465	\N
445d9928-751a-40e3-81be-409a0ac772a3	2025-10-08 18:31:56.24997+05:30	2025-10-08 18:31:56.287682+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-3B Summary Report	gstr3b_summary	excel	completed	{"toDate": "2025-10-08", "fromDate": "2025-09-30"}	{"toDate": "2025-10-08", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr3b_summary_2025-10-08T13-01-56-265Z.xlsx	1	2025-10-08 18:31:56.285	\N
58508ddf-293c-4329-95f7-85434279cfb9	2025-10-08 18:32:14.913371+05:30	2025-10-08 18:32:14.952285+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-3B Summary Report	gstr3b_summary	excel	completed	{"toDate": "2025-10-08", "fromDate": "2025-09-30"}	{"toDate": "2025-10-08", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr3b_summary_2025-10-08T13-02-14-923Z.xlsx	1	2025-10-08 18:32:14.949	\N
dde11086-61fb-4a7f-9394-8482eaf3451d	2025-10-08 18:32:41.359797+05:30	2025-10-08 18:32:41.382052+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Purchase Register Report	purchase_register	excel	completed	{"toDate": "2025-10-08", "fromDate": "2025-09-30"}	{"toDate": "2025-10-08", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\purchase_register_2025-10-08T13-02-41-366Z.xlsx	1	2025-10-08 18:32:41.379	\N
c3adfbb2-c985-4280-a407-5af5d2a287dc	2025-10-10 17:34:56.637186+05:30	2025-10-10 17:34:56.799727+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Sales Register Report	sales_register	excel	completed	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\sales_register_2025-10-10T12-04-56-670Z.xlsx	5	2025-10-10 17:34:56.796	\N
1e0b9fff-bf0d-4ec8-86e6-b5f458940ff5	2025-10-10 17:35:13.676038+05:30	2025-10-10 17:35:13.716024+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Sales Register Report	sales_register	excel	completed	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\sales_register_2025-10-10T12-05-13-692Z.xlsx	5	2025-10-10 17:35:13.713	\N
4362a1fb-c08e-421b-804c-44cdd1d4a49f	2025-10-10 17:38:05.859268+05:30	2025-10-10 17:38:05.988906+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Sales Register Report	sales_register	pdf	completed	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\sales_register_2025-10-10T12-08-05-893Z.pdf	5	2025-10-10 17:38:05.986	\N
9f5e2976-1802-42ec-9fe8-2cf2fac3c2a1	2025-10-10 17:38:21.312896+05:30	2025-10-10 17:38:21.3529+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	completed	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-10-10T12-08-21-324Z.xlsx	1	2025-10-10 17:38:21.349	\N
3e6134d9-c7e8-4ba9-9604-384fc769c58f	2025-10-10 17:39:33.004129+05:30	2025-10-10 17:39:33.058179+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Audit Trail Report	audit_trail	excel	completed	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\audit_trail_2025-10-10T12-09-33-033Z.xlsx	1	2025-10-10 17:39:33.055	\N
75b099de-13d6-4375-92ea-3876f0c3d48f	2025-10-10 17:40:53.728308+05:30	2025-10-10 17:40:53.765321+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-3B Summary Report	gstr3b_summary	excel	completed	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr3b_summary_2025-10-10T12-10-53-747Z.xlsx	1	2025-10-10 17:40:53.762	\N
ac4709ed-f5d0-41f2-8fa2-0ebe4ae40be4	2025-10-10 17:41:07.97651+05:30	2025-10-10 17:41:08.006299+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Sales Register Report	sales_register	excel	completed	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\sales_register_2025-10-10T12-11-07-988Z.xlsx	5	2025-10-10 17:41:08.003	\N
a3d8a980-18b1-4f3d-978f-d521eb8684ae	2025-10-10 17:41:14.615339+05:30	2025-10-10 17:41:14.63658+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Purchase Register Report	purchase_register	excel	completed	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\purchase_register_2025-10-10T12-11-14-622Z.xlsx	1	2025-10-10 17:41:14.634	\N
d5f8153f-7181-4ef1-8555-cabee0889f7a	2025-10-10 17:41:19.23863+05:30	2025-10-10 17:41:19.262995+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	HSN/SAC Wise Summary Report	hsn_summary	excel	completed	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\hsn_summary_2025-10-10T12-11-19-247Z.xlsx	1	2025-10-10 17:41:19.261	\N
ef57a6ce-0f1a-4548-8ff2-a0dde19825e3	2025-10-10 17:41:23.598776+05:30	2025-10-10 17:41:23.620477+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	TDS Report	tds_report	excel	completed	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	{"toDate": "2025-10-10", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\tds_report_2025-10-10T12-11-23-605Z.xlsx	1	2025-10-10 17:41:23.617	\N
ad6c54e2-7d0a-44b7-b4b3-620096347ce6	2025-10-17 15:03:12.804847+05:30	2025-10-17 15:03:12.997761+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	completed	{"toDate": "2025-10-17", "fromDate": "2025-09-30"}	{"toDate": "2025-10-17", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-10-17T09-33-12-836Z.xlsx	1	2025-10-17 15:03:12.992	\N
36c36906-da01-4697-9b98-82d5b6ef767c	2025-10-17 16:05:08.480827+05:30	2025-10-17 16:05:08.635216+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	HSN/SAC Wise Summary Report	hsn_summary	excel	completed	{"toDate": "2025-10-17", "fromDate": "2025-09-30"}	{"toDate": "2025-10-17", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\hsn_summary_2025-10-17T10-35-08-508Z.xlsx	1	2025-10-17 16:05:08.632	\N
2930ec0a-9424-44e6-a21f-5d0387097d05	2025-10-17 16:33:25.952494+05:30	2025-10-17 16:33:26.117848+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	GSTR-1 Outward Supplies Report	gstr1_outward_supplies	excel	completed	{"toDate": "2025-10-17", "fromDate": "2025-09-30"}	{"toDate": "2025-10-17", "fromDate": "2025-09-30"}	E:\\BillingSoftware-SaaS\\packages\\backend\\reports\\generated\\gstr1_outward_supplies_2025-10-17T11-03-25-997Z.xlsx	1	2025-10-17 16:33:26.106	\N
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (role_id, permission_id) FROM stdin;
d2e40836-787d-4742-a812-2a0c47a9cbf8	0167070f-4619-4e56-8e17-17e354222733
d2e40836-787d-4742-a812-2a0c47a9cbf8	adaf5a8b-7050-4971-9e80-66b8b27e9389
d2e40836-787d-4742-a812-2a0c47a9cbf8	906087fa-4770-4fae-a12e-1c1271662a58
d2e40836-787d-4742-a812-2a0c47a9cbf8	3b000d15-0490-493d-ae80-92decd0118b7
d2e40836-787d-4742-a812-2a0c47a9cbf8	67c77158-dbad-46ae-9e76-35da8add7bc0
d2e40836-787d-4742-a812-2a0c47a9cbf8	4d2c77af-c430-4db4-98bd-3db00226e718
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, is_system_role, "createdAt", "updatedAt") FROM stdin;
0b684511-fd45-47c6-8265-e071f9440580	Super Administrator	Full system access across all tenants	t	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30
d2e40836-787d-4742-a812-2a0c47a9cbf8	Billing Manager	Manages billing and subscriptions for their organization	f	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30
430e7a47-bf9f-425a-a994-94fe3754a51a	Finance User	Can view invoices and payment history	f	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30
8397cf14-ae6d-4c85-9775-b95056401d6d	System Viewer	Can view system usage but not make changes	f	2025-09-11 17:30:22.056134+05:30	2025-09-11 17:30:22.056134+05:30
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.settings (id, "createdAt", "updatedAt", "tenantId", "companyName", subdomain, "contactEmail", "contactPhone", address, "gstNumber") FROM stdin;
3e934564-e9a0-4854-8b4d-9bf7c03ed860	2025-09-22 16:58:32.451122+05:30	2025-09-22 16:58:32.451122+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	3SD Solutions and Services Pvt Ltd	https://3sdsolutions.com	info@3sdsolutions.com	+91 955-660-0999	SBI Building, Plot No: N5/538, 2nd Floor, IRC Village, Nayapalli, Bhubaneswar, Odisha 751015	22AAAAA0000A1Z5
4861a970-6a04-41be-8378-78aad83c1628	2025-10-07 13:02:37.841813+05:30	2025-10-07 13:02:37.841813+05:30	5485f417-e18a-4915-807e-168220a1a555	TATA Consultancy Services Limited	https://www.tcs.com/	info@tcs.com	0674-664 5507	Plot No. 4194557, Gayatri Vihar, Chandrasekharpur - 751024, Odisha	22AAAAA0000A1Z7
\.


--
-- Data for Name: subscription_changes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription_changes (id, subscription_id, requested_plan_id, scheduled_at, effective_date, prorated_amount, notes, requested_by, reviewed_at, "createdAt", "updatedAt", reviewed_by_user_id, "reviewedById", change_type, status) FROM stdin;
\.


--
-- Data for Name: subscription_plan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription_plan (id, "planType", name, description, price, "billingCycle", features, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription_plans (id, "createdAt", "updatedAt", price, features, "isActive", description, "trialDays", "tenantId", type, "billingCycle", "maxTenants", "maxBusinesses", "maxUsers", "validityDays", name, currency) FROM stdin;
ad483824-bb51-4318-bdf4-ca4a414c260d	2025-10-10 12:20:17.710155+05:30	2025-10-10 12:20:17.710155+05:30	999.00	["Email Support", "Analytics", "5GB Storage"]	t	Weekly plan with extended access for small businesses.	0	00000000-0000-0000-0000-000000000000	professional	monthly	2	2	10	7	Weekly Plan	INR
72d6f5d7-6e17-47f8-b378-4451ad34a747	2025-10-10 12:20:17.710155+05:30	2025-10-10 12:20:17.710155+05:30	1499.00	["Priority Support", "Unlimited Access", "50GB Storage"]	t	Full access with all premium features.	0	00000000-0000-0000-0000-000000000000	enterprise	monthly	5	5	20	30	Monthly Plan	INR
e31d8392-df53-4538-9aed-32cc168b1c58	2025-10-10 12:20:17.710155+05:30	2025-10-10 12:20:17.710155+05:30	0.00	["Basic Support", "Limited Access"]	t	Basic plan with limited features. Valid for 5 days.	0	00000000-0000-0000-0000-000000000000	basic	yearly	1	1	3	5	Free Plan	INR
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (id, "createdAt", "updatedAt", "tenantId", "planId", status, "startDate", "endDate", "cancelledAt", metadata, "autoRenew", "userId", "stripeSubscriptionId", "razorpaySubscriptionId") FROM stdin;
ce5885e8-a4d1-4c8f-80be-ec25b836050f	2025-10-13 16:24:53.155927+05:30	2025-10-13 16:24:53.155927+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	ad483824-bb51-4318-bdf4-ca4a414c260d	pending	2025-10-13 16:24:53.322	2025-10-20 16:24:53.322	\N	{"createdBy": "system"}	f	a1ac7272-dbda-4da5-b939-9b0ed8a12ebd	\N	\N
b90ef3ef-12ca-4e59-808c-e2b012d4d61b	2025-10-17 10:00:36.075524+05:30	2025-10-17 10:00:36.267387+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	e31d8392-df53-4538-9aed-32cc168b1c58	trial	2025-10-17 10:00:36.265	2025-11-01 10:00:36.265	\N	{"createdBy": "system"}	f	a1ac7272-dbda-4da5-b939-9b0ed8a12ebd	\N	\N
9e55f572-5605-4ef9-a419-9905b7e6658d	2025-10-23 15:24:15.274656+05:30	2025-10-23 15:24:15.304378+05:30	5485f417-e18a-4915-807e-168220a1a555	e31d8392-df53-4538-9aed-32cc168b1c58	trial	2025-10-23 15:24:15.302	2025-11-07 15:24:15.302	\N	{"createdBy": "system"}	f	e55e49de-1358-43f5-a535-9fd593e72bf0	\N	\N
c4610d34-6ef2-4260-a88a-2d14b33352d2	2025-10-23 16:03:55.340197+05:30	2025-10-23 16:03:55.526012+05:30	59576a9e-070e-4439-be71-0e33c8bd4386	e31d8392-df53-4538-9aed-32cc168b1c58	trial	2025-10-23 16:03:55.524	2025-11-07 16:03:55.524	\N	{"createdBy": "system"}	f	92f32d52-611b-4136-a1fb-2364a09e523a	\N	\N
\.


--
-- Data for Name: super_admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.super_admin (id, first_name, last_name, email, password_hash, is_active, permissions, "createdAt", "updatedAt", "userId") FROM stdin;
20398b85-b45e-4c65-8352-80107db982eb	Admin	User	admin@demo.com	$2a$12$zh.XxZ0laigIHUWpnba/fO3lQ9v4fql7WQpnEFygWOFu/t9nZSibC	t	{}	2025-10-22 11:21:48.385502	2025-10-22 11:21:48.385502	a1ac7272-dbda-4da5-b939-9b0ed8a12ebd
\.


--
-- Data for Name: super_admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.super_admins (id, email, first_name, last_name, password_hash, is_active, last_login_at, created_at, updated_at) FROM stdin;
09e4e708-86c7-48c8-a866-df986d676845	admin@billingplatform.com	Platform	Admin	$2a$12$zh.XxZ0laigIHUWpnba/fO3lQ9v4fql7WQpnEFygWOFu/t9nZSibC	t	\N	2025-09-11 15:03:42.017876+05:30	2025-09-11 15:03:42.017876+05:30
\.


--
-- Data for Name: syncLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."syncLog" (id, results, "tenantId", "userId", "timestamp") FROM stdin;
\.


--
-- Data for Name: tax_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_details (id, "taxName", "taxRate", "taxAmount", "taxableValue", "invoiceId", "createdAt", "updatedAt") FROM stdin;
05a76abc-38bb-496d-bdda-46bd521975a2	Tax 5%	5.00	16.00	320.00	45688c06-91ee-43ed-a4a7-6dbf2d3d8084	2025-10-17 14:58:32.942	2025-10-17 14:58:32.942
10ae2e8c-6ce8-452c-8a9f-70c103f0de2b	Tax 5%	5.00	16.00	320.00	45688c06-91ee-43ed-a4a7-6dbf2d3d8084	2025-10-17 14:58:58.657	2025-10-17 14:58:58.657
7464fc00-24ce-4c2b-af86-8523a5186764	Tax 5%	5.00	32.00	640.00	45688c06-91ee-43ed-a4a7-6dbf2d3d8084	2025-10-17 14:59:12.869267	2025-10-17 14:59:12.869267
\.


--
-- Data for Name: tax_rate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_rate (id, name, rate, "isActive", description, "tenantId", "productId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: tenant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant (id, name, subdomain, "isActive", "businessName", status, "trialEndsAt", "stripeCustomerId", slug, "createdAt", "updatedAt") FROM stdin;
e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Acme Corporation	acme	t	Acme Corporation Ltd.	active	2025-10-08 18:43:13.4313	cus_AcmeCorp12345	acme-corp	2024-09-01 10:00:00+05:30	2024-09-08 15:30:00+05:30
5485f417-e18a-4915-807e-168220a1a555	TechStart Inc	techstart	t	TechStart Innovations Inc.	trial	2024-10-08 18:43:13.4313	cus_TechStart67890	techstart-inc	2024-09-05 14:20:00+05:30	2024-09-08 16:45:00+05:30
ddd4d7aa-6255-429e-a9dc-88a5ff501f4a	Global Services	global	t	Global Business Services LLC	active	\N	cus_GlobalServices54321	global-services	2024-08-15 09:15:00+05:30	2024-09-07 11:20:00+05:30
54a2f4d8-15bd-4178-a330-3eceaa96e617	Sunrise Enterprises	sunrise	f	Sunrise Enterprise Solutions	suspended	2024-08-20 12:00:00	cus_Sunrise98765	sunrise-enterprises	2024-07-10 08:45:00+05:30	2024-09-06 14:10:00+05:30
ec6cfa75-9f6a-4eec-91a1-045402d701b7	MegaMart Retail	megamart	t	MegaMart Retail Chains	trial_expired	2024-08-25 00:00:00	cus_MegaMart24680	megamart-retail	2024-08-01 16:30:00+05:30	2024-09-08 10:15:00+05:30
a7d33b74-0421-4f54-bd58-7535297abb0f	Rout Shop	Routstore	t	Rout Variety Store	active	\N	\N	Routstore	2025-10-09 11:37:52.644766+05:30	2025-10-09 11:37:52.644766+05:30
7347e945-1620-41fb-8d6f-927bfbc9d5a7	Sahoo Store	Sahoostore	t	Sahoo Variety Store	active	\N	\N	Sahoostore	2025-10-09 11:47:41.501447+05:30	2025-10-09 11:47:41.501447+05:30
f56a3374-e528-4394-ba68-276b93c79b46	Barik Agencies	BarikAgencies	t	Barik Agencies	active	\N	\N	BarikAgencies	2025-10-09 11:58:13.239731+05:30	2025-10-09 11:58:13.239731+05:30
f66f1e60-bfba-435d-b979-4be7296fa43d	Swain Travels	swaintours&travels	t	Swain Tours and Travels	active	\N	\N	swaintours&travels	2025-10-09 12:12:36.855327+05:30	2025-10-09 12:12:36.855327+05:30
fea83109-3667-4aff-87ee-c6ad1b8d8a08	Mohanty Snacks	mohantysnacks	t	Mohanty Tea and Snacks	active	\N	\N	mohantysnacks	2025-10-09 12:46:30.07713+05:30	2025-10-09 12:46:30.07713+05:30
fc306445-dce3-4c4e-92ec-e829b2762a74	Reliance	reliancesmart	t	Reliance Smart	active	\N	\N	reliancesmart	2025-10-09 12:53:09.372077+05:30	2025-10-09 12:53:09.372077+05:30
a815563b-1f5a-46ed-b3a2-25cf9f91ad25	Pradhan Textiles	pradhantextiles	t	Pradhan fashion and textiles	active	\N	\N	pradhantextiles	2025-10-09 13:06:41.560187+05:30	2025-10-09 13:06:41.560187+05:30
ee271299-9c8c-4236-8890-a860329bb1b3	Pattnaik Enterprises	pattnaikenterprises	t	Pattnaik Enterprises	active	\N	\N	pattnaikenterprises	2025-10-09 13:09:56.810159+05:30	2025-10-09 13:09:56.810159+05:30
bc892cde-d155-4ad5-9e1b-a6886850978a	RadheKrisna Tiles	Radhekrishnatiles&marbels	t	Radhekrishan Tiles & Marbels	active	\N	\N	Radhekrishnatiles&marbels	2025-10-09 13:15:25.005428+05:30	2025-10-09 13:15:25.005428+05:30
52c27221-118d-42dc-8703-f1a4033c7af4	Rashmi Ranjan Rout	https://www.rcon.com/	t	Rout Construction	active	\N	\N	https://www.rcon.com/	2025-10-13 17:26:58.288271+05:30	2025-10-13 17:26:58.288271+05:30
6b4e95ba-6f0d-4357-8dd0-b352e975575d	Tarini Prasad  Roy	tarini.roy@3sdsolutions.com	t	Tarini Fashion	active	\N	\N	tarini.roy@3sdsolutions.com	2025-10-23 16:00:42.292109+05:30	2025-10-23 16:00:42.292109+05:30
59576a9e-070e-4439-be71-0e33c8bd4386	Tarini Roy	Tarini	t	Tarini Fashion	active	\N	\N	Tarini	2025-10-23 16:02:59.835391+05:30	2025-10-23 16:02:59.835391+05:30
\.


--
-- Data for Name: tenant_subscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant_subscription (id, "tenantId", "planId", status, "startDate", "endDate", "trialEndDate", amount, "isPaidByProfessional", "paidByProfessionalId", "stripeSubscriptionId", "stripeCustomerId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: usage_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usage_records (id, tenant_id, subscription_id, metric_code, quantity, recorded_at, recorded_by, created_at) FROM stdin;
c076f2ac-9eab-4890-83ed-24dfed088436	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	5e63cac8-e1bc-47b2-b050-82edc934588c	api_calls	150.0000	2023-10-21 17:30:00+05:30	\N	2025-09-11 15:14:16.395086+05:30
e7b4ea47-99d7-45c6-ab53-2699013752bc	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	5e63cac8-e1bc-47b2-b050-82edc934588c	api_calls	300.0000	2023-10-22 17:30:00+05:30	\N	2025-09-11 15:14:16.395086+05:30
9c3d4ed2-2c0c-4690-8737-2f1701991f6a	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	5e63cac8-e1bc-47b2-b050-82edc934588c	api_calls	200.0000	2023-10-23 17:30:00+05:30	\N	2025-09-11 15:14:16.395086+05:30
e3866603-0b75-421f-96b4-1e9fcce336f2	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	5e63cac8-e1bc-47b2-b050-82edc934588c	storage_gb	5.5000	2023-10-23 17:30:00+05:30	\N	2025-09-11 15:14:16.395086+05:30
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, email, password, "firstName", "lastName", "pushToken", "biometricEnabled", "tenantId", status, "createdAt", "updatedAt", "lastLoginAt", role) FROM stdin;
764e07b7-82fa-45dd-8812-d54eb9ad2bf2	chinmayee@gmail.com	$2a$12$zh.XxZ0laigIHUWpnba/fO3lQ9v4fql7WQpnEFygWOFu/t9nZSibC	Chinmayee	Padhi	\N	f	54a2f4d8-15bd-4178-a330-3eceaa96e617	active	2025-09-18 16:04:33.148586+05:30	2025-09-19 11:00:46.412219+05:30	2025-09-19 11:00:46.409	admin
c3606aa6-7ce6-4b96-bb57-a4a3a7b0aed7	user@demo.com	$2a$12$zh.XxZ0laigIHUWpnba/fO3lQ9v4fql7WQpnEFygWOFu/t9nZSibC	Demo	User	\N	f	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	active	2025-09-09 10:51:49.018665+05:30	2025-09-09 10:51:49.018665+05:30	\N	user
4eb3c409-7a39-4d46-88d4-875c7a5abac0	rekharani@gmail.com	$2a$12$zh.XxZ0laigIHUWpnba/fO3lQ9v4fql7WQpnEFygWOFu/t9nZSibC	Rekharani	Swain	\N	f	ddd4d7aa-6255-429e-a9dc-88a5ff501f4a	active	2025-09-18 16:04:33.148586+05:30	2025-09-18 17:30:56.987163+05:30	2025-09-18 17:30:56.983	admin
a430db25-d7cb-473a-8fc5-a5ccd7a42707	harekrishan@gmail.com	$2a$12$hh1fzfQzfATECN/8bk5wVezkFMf2EfZlt8lpZbOD.sHesoGoQuWLS	Harekrishna	Senapati	\N	f	fc306445-dce3-4c4e-92ec-e829b2762a74	active	2025-10-09 12:53:09.372077+05:30	2025-10-09 13:00:31.609414+05:30	2025-10-09 13:00:31.599	admin
eeab8061-7e39-44ab-8d06-a1d90a58e116	ratikant@gmail.com	$2a$12$UZnpyuH/e6e5uJhVPiiME.fsXM0DKWjIdo7Qj6WaRnqnLkQQGjWfa	Ratikant	Pradhan	\N	f	a815563b-1f5a-46ed-b3a2-25cf9f91ad25	active	2025-10-09 13:06:41.560187+05:30	2025-10-09 13:06:41.560187+05:30	\N	admin
1f2c2d04-d48e-44a0-980a-942b9f211bf3	pattnaik@gmail.com	$2a$12$L9dbqvjKBMaVFJEDPjxRvujBBWBdmI5XDk4quJjqdv36VLf9HpKgq	Sunil	Pattnaik	\N	f	ee271299-9c8c-4236-8890-a860329bb1b3	active	2025-10-09 13:09:56.810159+05:30	2025-10-09 13:09:56.810159+05:30	\N	admin
307d67c8-96ca-4696-baf1-c642d58362bd	radhekrishna@gmail.com	$2a$12$iWPO4.4cdMlu22FtmWo52.1USWhK29zRlkWjugV2MamNrQcwkXw9C	Radhekrishna	Parihari	\N	f	bc892cde-d155-4ad5-9e1b-a6886850978a	active	2025-10-09 13:15:25.005428+05:30	2025-10-09 13:18:30.548304+05:30	2025-10-09 13:18:30.54	admin
a5ef1d1d-f6f7-41b2-a066-513d57120ab3	ritika@gmail.com	$2a$12$IjOsfxwWnSyruHMYWpzDK.EX7OZGKRvBuiyGRCsKIj1ulA3OQB8GC	Ritikag	Kulkarni	\N	f	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	suspended	2025-10-17 11:03:08.29977+05:30	2025-10-22 17:25:43.164851+05:30	\N	user
92f32d52-611b-4136-a1fb-2364a09e523a	tariniprasad93@gmail.com	$2a$12$9eKC7oZSZ4OU7Bt1iECAZOzMYm52XvoBWgVI0GR46mzLzV5X81avm	Tarini Prasad	Roy	\N	f	59576a9e-070e-4439-be71-0e33c8bd4386	active	2025-10-23 16:02:59.835391+05:30	2025-10-23 16:07:32.934051+05:30	2025-10-23 16:03:31.766	admin
06eb39f3-b609-4e86-bc73-f123ef4ab5a9	professional@demo.com	$2a$12$DWFBfgtNqdwe9Ryss8MvBOTruIOBITS51caJLHXzoLQKgcSAobEwq	Professional	User	\N	f	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	active	2025-10-09 16:26:35.888277+05:30	2025-10-09 16:26:35.888277+05:30	\N	professional
3a3ac876-36b6-4ef2-a8a3-402f5fcc9bd4	supratik@gmail.com	$2a$12$OXwXeJOtVg2u0k4L.0FMQ.WYElLfwX1zHv4pBVXPFomAL0mHD/9E2	Supratik 	Padhi	\N	f	59576a9e-070e-4439-be71-0e33c8bd4386	suspended	2025-10-23 16:08:47.242267+05:30	2025-10-23 16:09:07.103809+05:30	\N	finance
fffc9003-99ca-48df-a016-71dc435ccf67	smruti@gmail.com	$2a$12$6DeaRpqSdWEWIZ6VcZdzAuChbXpgQ68LCGyy7wOeYaVqplM2aBSpq	Smruti 	Rout	\N	f	a7d33b74-0421-4f54-bd58-7535297abb0f	active	2025-10-09 11:37:52.644766+05:30	2025-10-09 11:37:52.644766+05:30	\N	admin
bf07a6ef-4b88-44e1-85a3-0c28c08a782f	babulidas@gmail.com	$2a$12$pTHRRF3Ce7.fkHvbm709uOaV92Q4AHIhBxK.ZC.zB9SouL14QhKTu	Babuli	Das	\N	f	7347e945-1620-41fb-8d6f-927bfbc9d5a7	active	2025-10-09 11:47:41.501447+05:30	2025-10-09 11:47:41.501447+05:30	\N	admin
7611ac30-ed4b-4774-a7fc-78a7db82fd94	yakub@gmail.com	$2a$12$suwUwyHl2Y5Rk/.Hf7Z1FOlHLxvsM5hl1cMwY0FsBck7PM8NIOt/K	Yakub	barik	\N	f	f56a3374-e528-4394-ba68-276b93c79b46	active	2025-10-09 11:58:13.239731+05:30	2025-10-09 11:58:13.239731+05:30	\N	admin
be195735-9e01-4f68-bfe5-8aa5af2016af	rashmi@gmail.com	$2a$12$Fm/QaGzItVlv.iLbGpdFre0VkKiczBKYOwRbE6yHv92JpKoIDtMgy	Rashmi Ranjan	Rout	\N	f	52c27221-118d-42dc-8703-f1a4033c7af4	active	2025-10-13 17:26:58.288271+05:30	2025-10-13 17:27:08.765489+05:30	2025-10-13 17:27:08.757	admin
af49ac73-071f-4474-bf37-796ab6160940	prasanjit@gmail.com	$2a$12$OLCdV/nc47Hlfa2M6Obd8u0T/pVXiGMZ3XC7J0pVG8YxVz1OAC4wa	Prasanjit	Swain	\N	f	f66f1e60-bfba-435d-b979-4be7296fa43d	active	2025-10-09 12:12:36.855327+05:30	2025-10-09 12:12:36.855327+05:30	\N	admin
6a11cbcb-8cda-4b00-8760-9dc3196d2ff8	babusan@gmail.com	$2a$12$stuvk4J2.ra0lC75df0Km.nN5e.0C82Qxo7WtlgKndVCA4ZoajZYO	Babusan	Mohanty	\N	f	fea83109-3667-4aff-87ee-c6ad1b8d8a08	active	2025-10-09 12:46:30.07713+05:30	2025-10-09 12:46:30.07713+05:30	\N	admin
a1ac7272-dbda-4da5-b939-9b0ed8a12ebd	admin@demo.com	$2a$12$zh.XxZ0laigIHUWpnba/fO3lQ9v4fql7WQpnEFygWOFu/t9nZSibC	Admin	User	\N	f	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	active	2025-09-09 10:51:49.018665+05:30	2025-10-23 15:51:33.247005+05:30	2025-10-23 15:51:33.243	super_admin
e55e49de-1358-43f5-a535-9fd593e72bf0	monalisa@gmail.com	$2a$12$zh.XxZ0laigIHUWpnba/fO3lQ9v4fql7WQpnEFygWOFu/t9nZSibC	Monalisa	Pradhan	\N	f	5485f417-e18a-4915-807e-168220a1a555	active	2025-09-18 16:04:33.148586+05:30	2025-10-23 15:58:49.429686+05:30	2025-10-23 15:58:49.427	admin
cced2b35-ca69-4ba7-bded-5e1c4fbb5426	tarini.roy@3sdsolutions.com	$2a$12$KYISFasCUplyAPgGf/55iuWHzZcFeUm1RQHjT828UBr1jFZL1tWD.	Tarini Prasad	 Roy	\N	f	6b4e95ba-6f0d-4357-8dd0-b352e975575d	active	2025-10-23 16:00:42.292109+05:30	2025-10-23 16:00:42.292109+05:30	\N	admin
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role_id) FROM stdin;
a1ac7272-dbda-4da5-b939-9b0ed8a12ebd	0b684511-fd45-47c6-8265-e071f9440580
c3606aa6-7ce6-4b96-bb57-a4a3a7b0aed7	d2e40836-787d-4742-a812-2a0c47a9cbf8
\.


--
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendors (id, "tenantId", name, email, phone, gstin, pan, "isActive", type, "billingAddress", "shippingAddress", "outstandingBalance", "paymentTerms", "deletedAt", metadata, "createdAt", "updatedAt") FROM stdin;
c7e08042-54bc-435d-a2c3-536e0134eb2d	ddd4d7aa-6255-429e-a9dc-88a5ff501f4a	ritu rd	rekharani@gmail.com	9550099960	22AAAAA0000A1Z9	ABCDE1234F	t	service_provider	{"city": "jagatsinghapur", "line1": "tentoi", "line2": "", "state": "odisha", "country": "India", "postalCode": "754113"}	{"city": "jagatsinghapur", "line1": "tentoi", "line2": "", "state": "odisha", "country": "India", "postalCode": "754113"}	0.00	online	\N	{}	2025-09-18 17:30:38.564695+05:30	2025-09-18 17:30:38.564695+05:30
2d81403d-00e6-4725-a4a0-6c8547a17895	54a2f4d8-15bd-4178-a330-3eceaa96e617	Sri enterprises	sri@gmail.com	7418529630	22AAAAA0000A1Z5	ABCDE1434F	t	supplier	{"city": "Bhubaneswar", "line1": "Lane 5", "line2": "", "state": "Odisha", "country": "India", "postalCode": "751002"}	{"city": "Bhubaneswar", "line1": "Lane 5", "line2": "", "state": "Odisha", "country": "India", "postalCode": "751002"}	280250.00	Due 400	\N	{}	2025-09-18 17:35:08.235906+05:30	2025-09-18 18:16:15.738796+05:30
7654aac1-f443-4fcc-8744-9a20d5b5cb5e	5485f417-e18a-4915-807e-168220a1a555	Subway	monalisa@gmail.com	9556600999	22AAAAA0000A1Z5	AABCZ4181H	t	supplier	{"city": "Bhubaneswar", "line1": "Bhubaneswar", "line2": "Bhubaneswar", "state": "Odisha", "country": "India", "postalCode": "751015"}	{"city": "Bhubaneswar", "line1": "Bhubaneswar", "line2": "Bhubaneswar", "state": "Odisha", "country": "India", "postalCode": "751015"}	0.00	due 30 rupees 	\N	{}	2025-09-18 18:27:56.548237+05:30	2025-09-18 18:28:23.87804+05:30
5481decc-fb17-41ed-9aec-68f4fb749e71	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	saumyaggg	\N		\N	\N	t	supplier	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	0.00		2025-09-20 10:25:25.405	{}	2025-09-20 10:18:03.745766+05:30	2025-09-20 10:25:25.409907+05:30
a692bc35-1b72-40ad-bdd1-7d02fdbcdb42	5485f417-e18a-4915-807e-168220a1a555	Ekart	ekart@gmail.com	9776236530	21AAATY5000A1Z5	ABCDE1236Y	t	service_provider	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	0.00	30	\N	{}	2025-10-08 11:22:16.448026+05:30	2025-10-08 11:22:16.448026+05:30
0bde0d95-5bf3-4f7a-9b5c-cc970cbcfe62	5485f417-e18a-4915-807e-168220a1a555	Blinkit	blinkit@gmail.com	9885623014	21AAAAA0110A1Z5	ABCDE3436Y	t	service_provider	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	2100.00	30	\N	{}	2025-10-08 11:28:51.53312+05:30	2025-10-08 11:30:50.154602+05:30
e610d9f9-a05b-4d7e-9119-3191ed678644	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Smriti Toy Indurstries	smriti@gmail.com	9776236509	21AAAAA0220A1Z5	ABCDE4434F	t	supplier	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	0.00	30	2025-10-17 11:12:03.497	{}	2025-10-17 11:11:39.750547+05:30	2025-10-17 11:12:03.500153+05:30
f651c95e-df21-4c77-8df3-2a1b75ada149	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	saumya	saumyajiku229@gmail.com	9776236509	21AAAAA0000A1Z5	ABCDE1234F	t	contractor	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	527.76	30	\N	{}	2025-09-16 19:24:19.740718+05:30	2025-10-17 12:27:22.617051+05:30
\.


--
-- Name: gstins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gstins_id_seq', 16, true);


--
-- Name: hsn_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hsn_codes_id_seq', 16, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 1, false);


--
-- Name: purchase_orders PK_05148947415204a897e8beb2553; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT "PK_05148947415204a897e8beb2553" PRIMARY KEY (id);


--
-- Name: settings PK_0669fe20e252eb692bf4d344975; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY (id);


--
-- Name: audit_log PK_07fefa57f7f5ab8fc3f52b3ed0b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT "PK_07fefa57f7f5ab8fc3f52b3ed0b" PRIMARY KEY (id);


--
-- Name: customers PK_133ec679a801fab5e070f73d3ea; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY (id);


--
-- Name: payments PK_197ab7af18c93fbb0c9b28b4a59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY (id);


--
-- Name: tax_rate PK_23b71b53f650c0b39e99ccef4fd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT "PK_23b71b53f650c0b39e99ccef4fd" PRIMARY KEY (id);


--
-- Name: user_roles PK_23ed6f04fe43066df08379fd034; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY (user_id, role_id);


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: role_permissions PK_25d24010f53bb80b78e412c9656; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY (role_id, permission_id);


--
-- Name: super_admin PK_3c4fab866f4c62a54ee1ebb1fe3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.super_admin
    ADD CONSTRAINT "PK_3c4fab866f4c62a54ee1ebb1fe3" PRIMARY KEY (id);


--
-- Name: professional_tenants PK_3fa042b1c73cc53f164f9736ab9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_tenants
    ADD CONSTRAINT "PK_3fa042b1c73cc53f164f9736ab9" PRIMARY KEY (id);


--
-- Name: invoice_items PK_53b99f9e0e2945e69de1a12b75a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT "PK_53b99f9e0e2945e69de1a12b75a" PRIMARY KEY (id);


--
-- Name: payments_invoice PK_563a5e248518c623eebd987d43e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments_invoice
    ADD CONSTRAINT "PK_563a5e248518c623eebd987d43e" PRIMARY KEY (id);


--
-- Name: professional_users PK_5f58bc33a25df1d6afdea17a7ee; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_users
    ADD CONSTRAINT "PK_5f58bc33a25df1d6afdea17a7ee" PRIMARY KEY (id);


--
-- Name: subscription_plan PK_5fde988e5d9b9a522d70ebec27c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_plan
    ADD CONSTRAINT "PK_5fde988e5d9b9a522d70ebec27c" PRIMARY KEY (id);


--
-- Name: invoices PK_668cef7c22a427fd822cc1be3ce; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY (id);


--
-- Name: tax_details PK_942421de693b399fa7c61cd6403; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_details
    ADD CONSTRAINT "PK_942421de693b399fa7c61cd6403" PRIMARY KEY (id);


--
-- Name: expenses PK_94c3ceb17e3140abc9282c20610; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY (id);


--
-- Name: loyalty_programs PK_9911f010986d7730cc744f91ff4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_programs
    ADD CONSTRAINT "PK_9911f010986d7730cc744f91ff4" PRIMARY KEY (id);


--
-- Name: subscription_plans PK_9ab8fe6918451ab3d0a4fb6bb0c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c" PRIMARY KEY (id);


--
-- Name: vendors PK_9c956c9797edfae5c6ddacc4e6e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT "PK_9c956c9797edfae5c6ddacc4e6e" PRIMARY KEY (id);


--
-- Name: customer_loyalty PK_a1e242fce03ed40eaf40a5f786f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_loyalty
    ADD CONSTRAINT "PK_a1e242fce03ed40eaf40a5f786f" PRIMARY KEY (id);


--
-- Name: subscriptions PK_a87248d73155605cf782be9ee5e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY (id);


--
-- Name: purchase_order PK_ad3e1c7b862f4043b103a6c8c60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT "PK_ad3e1c7b862f4043b103a6c8c60" PRIMARY KEY (id);


--
-- Name: reports PK_d9013193989303580053c0b5ef6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY (id);


--
-- Name: tenant_subscription PK_d91b66c187ed664d890944a9776; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_subscription
    ADD CONSTRAINT "PK_d91b66c187ed664d890944a9776" PRIMARY KEY (id);


--
-- Name: loyalty_transactions PK_df453f678b7575221b335673362; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_transactions
    ADD CONSTRAINT "PK_df453f678b7575221b335673362" PRIMARY KEY (id);


--
-- Name: professional_user PK_e3398315ec4259b240b032299c0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_user
    ADD CONSTRAINT "PK_e3398315ec4259b240b032299c0" PRIMARY KEY (id);


--
-- Name: purchase_items PK_e3d9bea880baad86ff6de3290da; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_items
    ADD CONSTRAINT "PK_e3d9bea880baad86ff6de3290da" PRIMARY KEY (id);


--
-- Name: purchase_order_item PK_f3eaf81afb216ae78a59cc19503; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_item
    ADD CONSTRAINT "PK_f3eaf81afb216ae78a59cc19503" PRIMARY KEY (id);


--
-- Name: professional_users UQ_025ff099e6ba257718e44d409f1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_users
    ADD CONSTRAINT "UQ_025ff099e6ba257718e44d409f1" UNIQUE ("userId");


--
-- Name: super_admin UQ_1ce171ef935f892c7f13004f232; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.super_admin
    ADD CONSTRAINT "UQ_1ce171ef935f892c7f13004f232" UNIQUE (email);


--
-- Name: purchase_order UQ_77337c18030c356d46aa9f28858; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT "UQ_77337c18030c356d46aa9f28858" UNIQUE ("poNumber");


--
-- Name: super_admin UQ_d421414492f9e1e4d2053f12d43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.super_admin
    ADD CONSTRAINT "UQ_d421414492f9e1e4d2053f12d43" UNIQUE ("userId");


--
-- Name: client client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);


--
-- Name: credit_notes_applications credit_notes_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_notes_applications
    ADD CONSTRAINT credit_notes_applications_pkey PRIMARY KEY (id);


--
-- Name: credit_notes credit_notes_credit_note_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_notes
    ADD CONSTRAINT credit_notes_credit_note_number_key UNIQUE (credit_note_number);


--
-- Name: credit_notes credit_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_notes
    ADD CONSTRAINT credit_notes_pkey PRIMARY KEY (id);


--
-- Name: gstins gstins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gstins
    ADD CONSTRAINT gstins_pkey PRIMARY KEY (id);


--
-- Name: hsn_codes hsn_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hsn_codes
    ADD CONSTRAINT hsn_codes_pkey PRIMARY KEY (id);


--
-- Name: invoice invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT invoice_pkey PRIMARY KEY (id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: payment_methods payment_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_methods
    ADD CONSTRAINT payment_methods_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: plan_features plan_features_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_features
    ADD CONSTRAINT plan_features_pkey PRIMARY KEY (id);


--
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: subscription_changes subscription_changes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_changes
    ADD CONSTRAINT subscription_changes_pkey PRIMARY KEY (id);


--
-- Name: super_admins super_admins_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.super_admins
    ADD CONSTRAINT super_admins_email_key UNIQUE (email);


--
-- Name: super_admins super_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.super_admins
    ADD CONSTRAINT super_admins_pkey PRIMARY KEY (id);


--
-- Name: syncLog syncLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."syncLog"
    ADD CONSTRAINT "syncLog_pkey" PRIMARY KEY (id);


--
-- Name: tenant tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant
    ADD CONSTRAINT tenant_pkey PRIMARY KEY (id);


--
-- Name: usage_records usage_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_records
    ADD CONSTRAINT usage_records_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: IDX_17022daf3f885f7d35423e9971; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON public.role_permissions USING btree (permission_id);


--
-- Name: IDX_178199805b901ccd220ab7740e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON public.role_permissions USING btree (role_id);


--
-- Name: IDX_1c9b5fb7b9f38cccddd7c5761b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_1c9b5fb7b9f38cccddd7c5761b" ON public.payments USING btree ("userId", "createdAt");


--
-- Name: IDX_3e9d388c10c2c52e89f65c60d5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3e9d388c10c2c52e89f65c60d5" ON public.product_tax_rates USING btree (tax_rate_id);


--
-- Name: IDX_63a284e4446aa8efee9dff1ea8; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_63a284e4446aa8efee9dff1ea8" ON public.payments USING btree ("tenantId", status);


--
-- Name: IDX_7a624398899f3b73f3c12f9955; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7a624398899f3b73f3c12f9955" ON public.subscriptions USING btree ("tenantId", status);


--
-- Name: IDX_87b8888186ca9769c960e92687; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON public.user_roles USING btree (user_id);


--
-- Name: IDX_INVOICES_CUSTOMER; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_INVOICES_CUSTOMER" ON public.invoices USING btree ("customerId");


--
-- Name: IDX_INVOICES_DELETED_AT; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_INVOICES_DELETED_AT" ON public.invoices USING btree ("deletedAt");


--
-- Name: IDX_INVOICES_DUE_DATE; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_INVOICES_DUE_DATE" ON public.invoices USING btree ("dueDate");


--
-- Name: IDX_INVOICES_ISSUE_DATE; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_INVOICES_ISSUE_DATE" ON public.invoices USING btree ("issueDate");


--
-- Name: IDX_INVOICES_NUMBER; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_INVOICES_NUMBER" ON public.invoices USING btree ("invoiceNumber");


--
-- Name: IDX_INVOICES_STATUS; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_INVOICES_STATUS" ON public.invoices USING btree (status);


--
-- Name: IDX_INVOICES_TENANT_CREATED_ID; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_INVOICES_TENANT_CREATED_ID" ON public.invoices USING btree ("tenantId", "createdAt", id);


--
-- Name: IDX_INVOICES_TENANT_CUSTOMER_DELETED; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_INVOICES_TENANT_CUSTOMER_DELETED" ON public.invoices USING btree ("tenantId", "customerId", "deletedAt");


--
-- Name: IDX_INVOICES_TENANT_DELETED; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_INVOICES_TENANT_DELETED" ON public.invoices USING btree ("tenantId", "deletedAt");


--
-- Name: IDX_INVOICES_TENANT_DUE_DATE_DELETED; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_INVOICES_TENANT_DUE_DATE_DELETED" ON public.invoices USING btree ("tenantId", "dueDate", "deletedAt");


--
-- Name: IDX_INVOICES_TENANT_NUMBER; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_INVOICES_TENANT_NUMBER" ON public.invoices USING btree ("tenantId", "invoiceNumber");


--
-- Name: IDX_INVOICES_TENANT_STATUS_DELETED; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_INVOICES_TENANT_STATUS_DELETED" ON public.invoices USING btree ("tenantId", status, "deletedAt");


--
-- Name: IDX_a1da63250e49e1cfb2cf9bacfa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_a1da63250e49e1cfb2cf9bacfa" ON public.tenant USING btree (subdomain);


--
-- Name: IDX_abfd243f7bd832e806d19c5a91; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_abfd243f7bd832e806d19c5a91" ON public.tenant USING btree (slug);


--
-- Name: IDX_b23c65e50a758245a33ee35fda; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON public.user_roles USING btree (role_id);


--
-- Name: IDX_e12875dfb3b1d92d7d7c5377e2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON public."user" USING btree (email);


--
-- Name: IDX_e196726779865f5bffb8bd93be; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e196726779865f5bffb8bd93be" ON public.subscription_plans USING btree ("tenantId", "isActive");


--
-- Name: IDX_f2a37d226c4f58242548e53c6b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f2a37d226c4f58242548e53c6b" ON public.subscriptions USING btree ("userId", status);


--
-- Name: idx_sync_log_tenant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sync_log_tenant ON public."syncLog" USING btree ("tenantId");


--
-- Name: idx_sync_log_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sync_log_user ON public."syncLog" USING btree ("userId");


--
-- Name: idx_usage_records_recorded_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usage_records_recorded_at ON public.usage_records USING btree (recorded_at);


--
-- Name: idx_usage_records_tenant_metric; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usage_records_tenant_metric ON public.usage_records USING btree (tenant_id, metric_code);


--
-- Name: tenant_subscription FK_0588c0effb6aad4f5d600871fab; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_subscription
    ADD CONSTRAINT "FK_0588c0effb6aad4f5d600871fab" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


--
-- Name: subscriptions FK_0c5fe8e5f9f4dd4a8c0134abc9c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT "FK_0c5fe8e5f9f4dd4a8c0134abc9c" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: purchase_order FK_0cfd30f4aadb68debc6a32554c1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT "FK_0cfd30f4aadb68debc6a32554c1" FOREIGN KEY ("vendorId") REFERENCES public.vendors(id);


--
-- Name: tenant_subscription FK_0edb3690c9bf622820ca13d04e4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_subscription
    ADD CONSTRAINT "FK_0edb3690c9bf622820ca13d04e4" FOREIGN KEY ("paidByProfessionalId") REFERENCES public.professional_user(id);


--
-- Name: purchase_order_item FK_13ef910b84865fed2a2799dea55; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_item
    ADD CONSTRAINT "FK_13ef910b84865fed2a2799dea55" FOREIGN KEY ("purchaseOrderId") REFERENCES public.purchase_order(id) ON DELETE CASCADE;


--
-- Name: role_permissions FK_17022daf3f885f7d35423e9971e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions FK_178199805b901ccd220ab7740ec; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tax_rate FK_19eeb78bd86b0d4754980213c93; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT "FK_19eeb78bd86b0d4754980213c93" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: notification FK_1ced25315eb974b73391fb1c81b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: invoices FK_1df049f8943c6be0c1115541efb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "FK_1df049f8943c6be0c1115541efb" FOREIGN KEY ("customerId") REFERENCES public.customers(id);


--
-- Name: settings FK_1fa41192963d6275ba8952f02a9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT "FK_1fa41192963d6275ba8952f02a9" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: payments FK_2017d0cbfdbfec6b1b388e6aa08; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_2017d0cbfdbfec6b1b388e6aa08" FOREIGN KEY ("subscriptionId") REFERENCES public.subscriptions(id);


--
-- Name: payments_invoice FK_277d73eaa88c531d8a4bf427717; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments_invoice
    ADD CONSTRAINT "FK_277d73eaa88c531d8a4bf427717" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


--
-- Name: payments_invoice FK_285f56e0f4c9405a5df85570d62; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments_invoice
    ADD CONSTRAINT "FK_285f56e0f4c9405a5df85570d62" FOREIGN KEY ("customerId") REFERENCES public.customers(id);


--
-- Name: purchase_orders FK_299ed1b81cad44317acbf02bab9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT "FK_299ed1b81cad44317acbf02bab9" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


--
-- Name: invoices FK_2c09534a63cf2e612ab2ca3a252; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "FK_2c09534a63cf2e612ab2ca3a252" FOREIGN KEY ("subscriptionId") REFERENCES public.subscriptions(id);


--
-- Name: tax_details FK_30903065c1015037b885d416090; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_details
    ADD CONSTRAINT "FK_30903065c1015037b885d416090" FOREIGN KEY ("invoiceId") REFERENCES public.invoices(id) ON DELETE CASCADE;


--
-- Name: reports FK_30c194a28f772a48affd3dfc509; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "FK_30c194a28f772a48affd3dfc509" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


--
-- Name: plan_features FK_33f1dcdcdf132c3a113e8c4505d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_features
    ADD CONSTRAINT "FK_33f1dcdcdf132c3a113e8c4505d" FOREIGN KEY ("planId") REFERENCES public.plans(id) ON DELETE CASCADE;


--
-- Name: customers FK_37c1a605468d156e6a8f78f1dc5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "FK_37c1a605468d156e6a8f78f1dc5" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


--
-- Name: audit_log FK_39b280b0956d0a640437783b6da; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT "FK_39b280b0956d0a640437783b6da" FOREIGN KEY ("performedById") REFERENCES public.super_admin(id);


--
-- Name: tax_rate FK_3c3ca333867faf745a6ea223664; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT "FK_3c3ca333867faf745a6ea223664" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: product_tax_rates FK_3e9d388c10c2c52e89f65c60d5b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tax_rates
    ADD CONSTRAINT "FK_3e9d388c10c2c52e89f65c60d5b" FOREIGN KEY (tax_rate_id) REFERENCES public.tax_rate(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: gstins FK_40945a581f93148bf3d93093767; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gstins
    ADD CONSTRAINT "FK_40945a581f93148bf3d93093767" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: categories FK_46a85229c9953b2b94f768190b2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "FK_46a85229c9953b2b94f768190b2" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


--
-- Name: syncLog FK_46cea327c6fd8265b573029b7fd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."syncLog"
    ADD CONSTRAINT "FK_46cea327c6fd8265b573029b7fd" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: subscription_changes FK_4c9cf0c86bc78ff2c8fbe1916c3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_changes
    ADD CONSTRAINT "FK_4c9cf0c86bc78ff2c8fbe1916c3" FOREIGN KEY ("reviewedById") REFERENCES public."user"(id);


--
-- Name: purchase_order FK_520ac6cb57f3511b832666ab0a9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT "FK_520ac6cb57f3511b832666ab0a9" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


--
-- Name: purchase_items FK_5b31a541ce1fc1f428db518efa4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_items
    ADD CONSTRAINT "FK_5b31a541ce1fc1f428db518efa4" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: loyalty_transactions FK_652010695a854dd52f21ceb485f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_transactions
    ADD CONSTRAINT "FK_652010695a854dd52f21ceb485f" FOREIGN KEY ("customerId") REFERENCES public.customers(id);


--
-- Name: loyalty_programs FK_657eee6642ffe82a58534d817b1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_programs
    ADD CONSTRAINT "FK_657eee6642ffe82a58534d817b1" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


--
-- Name: products FK_6804855ba1a19523ea57e0769b4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_6804855ba1a19523ea57e0769b4" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


--
-- Name: user FK_685bf353c85f23b6f848e4dcded; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_685bf353c85f23b6f848e4dcded" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: loyalty_transactions FK_6b3e28f56b03c2d4113af21a969; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_transactions
    ADD CONSTRAINT "FK_6b3e28f56b03c2d4113af21a969" FOREIGN KEY ("invoiceId") REFERENCES public.invoices(id);


--
-- Name: subscriptions FK_7536cba909dd7584a4640cad7d5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT "FK_7536cba909dd7584a4640cad7d5" FOREIGN KEY ("planId") REFERENCES public.subscription_plans(id);


--
-- Name: invoice_items FK_78ed705e1b4c256d7f168e0eec0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT "FK_78ed705e1b4c256d7f168e0eec0" FOREIGN KEY ("hsnId") REFERENCES public.hsn_codes(id);


--
-- Name: invoice_items FK_7bec360ed9928668b73dac2ec17; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT "FK_7bec360ed9928668b73dac2ec17" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: invoice FK_7fb52a5f267f53b7d93af3d8c3c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT "FK_7fb52a5f267f53b7d93af3d8c3c" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: invoice_items FK_7fb6895fc8fad9f5200e91abb59; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT "FK_7fb6895fc8fad9f5200e91abb59" FOREIGN KEY ("invoiceId") REFERENCES public.invoices(id) ON DELETE CASCADE;


--
-- Name: client FK_810b65a0776d2aa7bd93115a682; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT "FK_810b65a0776d2aa7bd93115a682" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: user_roles FK_87b8888186ca9769c960e926870; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoices FK_89c82485e364081f457b210120d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "FK_89c82485e364081f457b210120d" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


--
-- Name: subscription_changes FK_8b466302e4a5872c7b32c7c71f0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_changes
    ADD CONSTRAINT "FK_8b466302e4a5872c7b32c7c71f0" FOREIGN KEY (requested_by) REFERENCES public."user"(id);


--
-- Name: hsn_codes FK_8d6e4865c2aa7689b287f1a2f0c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hsn_codes
    ADD CONSTRAINT "FK_8d6e4865c2aa7689b287f1a2f0c" FOREIGN KEY (tenantid) REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: invoice FK_925aa26ea12c28a6adb614445ee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT "FK_925aa26ea12c28a6adb614445ee" FOREIGN KEY ("customerId") REFERENCES public.customers(id);


--
-- Name: professional_tenants FK_92ad2c170708528dab9d3fb11ca; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_tenants
    ADD CONSTRAINT "FK_92ad2c170708528dab9d3fb11ca" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


--
-- Name: categories FK_9a6f051e66982b5f0318981bcaa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES public.categories(id);


--
-- Name: vendors FK_a6cb7c5509d137311b2de27a123; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT "FK_a6cb7c5509d137311b2de27a123" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


--
-- Name: products FK_a79450cd222bebbead85991b35f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_a79450cd222bebbead85991b35f" FOREIGN KEY ("hsnId") REFERENCES public.hsn_codes(id) ON DELETE SET NULL;


--
-- Name: professional_tenants FK_a874eb4a7945f64df2ad13993f0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_tenants
    ADD CONSTRAINT "FK_a874eb4a7945f64df2ad13993f0" FOREIGN KEY ("professionalId") REFERENCES public.professional_user(id);


--
-- Name: user_roles FK_b23c65e50a758245a33ee35fda1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoices FK_b51f0a63f26d94b05eec7f29e57; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "FK_b51f0a63f26d94b05eec7f29e57" FOREIGN KEY ("gstinId") REFERENCES public.gstins(id);


--
-- Name: syncLog FK_c3d9658f55c6661fff1994ff30b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."syncLog"
    ADD CONSTRAINT "FK_c3d9658f55c6661fff1994ff30b" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: customer_loyalty FK_c5548d80563e0fa29dde25f0d13; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_loyalty
    ADD CONSTRAINT "FK_c5548d80563e0fa29dde25f0d13" FOREIGN KEY ("customerId") REFERENCES public.customers(id);


--
-- Name: customer_loyalty FK_c95062eeba75f26090c9b145acb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_loyalty
    ADD CONSTRAINT "FK_c95062eeba75f26090c9b145acb" FOREIGN KEY ("programId") REFERENCES public.loyalty_programs(id);


--
-- Name: payments_invoice FK_cc1ec8985d5081b876638626a79; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments_invoice
    ADD CONSTRAINT "FK_cc1ec8985d5081b876638626a79" FOREIGN KEY ("vendorId") REFERENCES public.vendors(id);


--
-- Name: subscription_changes FK_cfb93eddffb44cdde547a3c9849; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_changes
    ADD CONSTRAINT "FK_cfb93eddffb44cdde547a3c9849" FOREIGN KEY (requested_plan_id) REFERENCES public.plans(id);


--
-- Name: payments FK_d35cb3c13a18e1ea1705b2817b1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: super_admin FK_d421414492f9e1e4d2053f12d43; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.super_admin
    ADD CONSTRAINT "FK_d421414492f9e1e4d2053f12d43" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: tenant_subscription FK_d4a8309bd9afeb4bcf103447d6f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_subscription
    ADD CONSTRAINT "FK_d4a8309bd9afeb4bcf103447d6f" FOREIGN KEY ("planId") REFERENCES public.subscription_plans(id);


--
-- Name: invoice FK_de7d020d8f0708de874d1776912; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT "FK_de7d020d8f0708de874d1776912" FOREIGN KEY ("gstinId") REFERENCES public.gstins(id);


--
-- Name: purchase_orders FK_e04bec5cd5b302470c3ae474e1c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT "FK_e04bec5cd5b302470c3ae474e1c" FOREIGN KEY ("vendorId") REFERENCES public.vendors(id);


--
-- Name: loyalty_transactions FK_e655a5343ee3cd54a46b0525f3f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_transactions
    ADD CONSTRAINT "FK_e655a5343ee3cd54a46b0525f3f" FOREIGN KEY ("programId") REFERENCES public.loyalty_programs(id);


--
-- Name: payments_invoice FK_e6a9e9693bd8f66af6cee5d10ba; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments_invoice
    ADD CONSTRAINT "FK_e6a9e9693bd8f66af6cee5d10ba" FOREIGN KEY ("invoiceId") REFERENCES public.invoices(id);


--
-- Name: purchase_items FK_e7898261babdbcab609c0aead7f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_items
    ADD CONSTRAINT "FK_e7898261babdbcab609c0aead7f" FOREIGN KEY ("purchaseOrderId") REFERENCES public.purchase_orders(id) ON DELETE CASCADE;


--
-- Name: professional_user FK_effd89f081f9890a07734a046e8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_user
    ADD CONSTRAINT "FK_effd89f081f9890a07734a046e8" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: expenses FK_f754faa125acaf008866b6635bc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT "FK_f754faa125acaf008866b6635bc" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


--
-- Name: subscriptions FK_fbdba4e2ac694cf8c9cecf4dc84; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: products FK_ff56834e735fa78a15d0cf21926; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES public.categories(id);


--
-- Name: credit_notes_applications credit_notes_applications_applied_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_notes_applications
    ADD CONSTRAINT credit_notes_applications_applied_by_fkey FOREIGN KEY (applied_by) REFERENCES public."user"(id);


--
-- Name: credit_notes_applications credit_notes_applications_credit_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_notes_applications
    ADD CONSTRAINT credit_notes_applications_credit_note_id_fkey FOREIGN KEY (credit_note_id) REFERENCES public.credit_notes(id) ON DELETE CASCADE;


--
-- Name: credit_notes_applications credit_notes_applications_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_notes_applications
    ADD CONSTRAINT credit_notes_applications_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoice(id);


--
-- Name: credit_notes credit_notes_original_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_notes
    ADD CONSTRAINT credit_notes_original_invoice_id_fkey FOREIGN KEY (original_invoice_id) REFERENCES public.invoice(id);


--
-- Name: credit_notes credit_notes_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_notes
    ADD CONSTRAINT credit_notes_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: product_tax_rates fk_product_tax_rates_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tax_rates
    ADD CONSTRAINT fk_product_tax_rates_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: payment_methods payment_methods_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_methods
    ADD CONSTRAINT payment_methods_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- Name: usage_records usage_records_recorded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_records
    ADD CONSTRAINT usage_records_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public."user"(id);


--
-- Name: usage_records usage_records_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_records
    ADD CONSTRAINT usage_records_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict rnv8tPThEMaheH1LEcO4EQWlMBuY2Av9foffDeWpKdwawUjSvHXanU7LWmTiYAD

