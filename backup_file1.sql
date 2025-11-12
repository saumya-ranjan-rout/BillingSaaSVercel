--
-- PostgreSQL database dump
--

\restrict LxdvkgP6Lqo9QyztCggndy6hKLbAc5vu5aZkwPYyJ2L0pueFRnszfzvfgwmenXW

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
-- Name: payments_method_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_method_enum AS ENUM (
    'card',
    'netbanking',
    'upi',
    'wallet',
    'bank_transfer'
);


ALTER TYPE public.payments_method_enum OWNER TO postgres;

--
-- Name: payments_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_status_enum AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded',
    'cancelled'
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
-- Name: subscription_plans_billingperiod_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscription_plans_billingperiod_enum AS ENUM (
    'monthly',
    'yearly',
    'lifetime'
);


ALTER TYPE public.subscription_plans_billingperiod_enum OWNER TO postgres;

--
-- Name: subscription_plans_plantype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscription_plans_plantype_enum AS ENUM (
    'tenant',
    'professional'
);


ALTER TYPE public.subscription_plans_plantype_enum OWNER TO postgres;

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
-- Name: subscriptions_paymentgateway_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscriptions_paymentgateway_enum AS ENUM (
    'razorpay',
    'stripe',
    'paypal',
    'manual'
);


ALTER TYPE public.subscriptions_paymentgateway_enum OWNER TO postgres;

--
-- Name: subscriptions_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.subscriptions_status_enum AS ENUM (
    'active',
    'pending',
    'cancelled',
    'expired',
    'paused',
    'trialing'
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
    "tenantId" character varying NOT NULL,
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
    CONSTRAINT credit_notes_reason_check CHECK (((reason)::text = ANY ((ARRAY['refund'::character varying, 'adjustment'::character varying, 'write_off'::character varying])::text[]))),
    CONSTRAINT credit_notes_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'applied'::character varying, 'void'::character varying])::text[])))
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
    CONSTRAINT payment_methods_type_check CHECK (((type)::text = ANY ((ARRAY['card'::character varying, 'bank_account'::character varying, 'paypal'::character varying])::text[])))
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
    method public.payments_method_enum NOT NULL,
    status public.payments_status_enum DEFAULT 'pending'::public.payments_status_enum NOT NULL,
    notes text,
    "deletedAt" timestamp without time zone,
    "subscriptionId" uuid NOT NULL,
    "professionalId" uuid,
    currency character varying NOT NULL,
    "gatewayPaymentId" character varying,
    "gatewayOrderId" character varying,
    "gatewayResponse" jsonb,
    receipt character varying,
    "refundDetails" jsonb,
    "refundedAt" timestamp without time zone,
    "paymentDate" timestamp without time zone NOT NULL,
    "invoiceId" character varying
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
    name character varying NOT NULL,
    "planType" public.subscription_plans_plantype_enum NOT NULL,
    "billingPeriod" public.subscription_plans_billingperiod_enum DEFAULT 'yearly'::public.subscription_plans_billingperiod_enum NOT NULL,
    price numeric(10,2) NOT NULL,
    currency character varying NOT NULL,
    features jsonb NOT NULL,
    limits jsonb DEFAULT '{}'::jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    description text,
    "trialDays" integer DEFAULT 0 NOT NULL
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
    "professionalId" uuid,
    status public.subscriptions_status_enum DEFAULT 'pending'::public.subscriptions_status_enum NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying NOT NULL,
    "startDate" timestamp without time zone NOT NULL,
    "endDate" timestamp without time zone NOT NULL,
    "cancelledAt" timestamp without time zone,
    "trialEndsAt" timestamp without time zone,
    "paymentGateway" public.subscriptions_paymentgateway_enum DEFAULT 'razorpay'::public.subscriptions_paymentgateway_enum NOT NULL,
    "paymentGatewayId" character varying,
    "paymentGatewaySubscriptionId" character varying,
    "paymentDetails" jsonb,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "autoRenew" boolean DEFAULT false NOT NULL,
    "nextBillingDate" timestamp without time zone,
    "cancelAtPeriodEnd" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: super_admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.super_admin (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" character varying NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    password_hash character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    permissions jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
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
044a11df-c9b8-42e3-9e8d-b9dc50782435	2025-10-08 10:05:33.808636+05:30	2025-10-08 10:05:33.808636+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Sriram Panda	business	sriram@gmail.com	6532547890	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAA1200A1Z5	\N	t	0.00	{}	\N
ab1162b6-5784-433d-928a-4b1eef780757	2025-10-08 10:15:14.440717+05:30	2025-10-08 10:15:14.440717+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	Anubhav Mohanty	business	anubhav@gmail.com	7896541230	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAB1000A1Z5	\N	t	0.00	{}	\N
6322506a-bab9-4e29-a640-8e0fdefedb66	2025-10-08 10:22:13.909568+05:30	2025-10-08 10:22:13.909568+05:30	5485f417-e18a-4915-807e-168220a1a555	Manoj Jena	business	manoj@gmail.com	7856954123	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAB5000A1Z0	\N	t	0.00	{}	\N
4e3c657e-9c1b-468e-8448-f52e3055c93f	2025-10-08 10:30:18.564757+05:30	2025-10-08 10:30:18.564757+05:30	5485f417-e18a-4915-807e-168220a1a555	madhusudan Jena	business	madhusudan@gmail.com	7854210369	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAB4000A1Z0	\N	t	0.00	{}	\N
73507e1e-3e5d-4bd4-a718-d6701710f82e	2025-10-08 10:31:59.775427+05:30	2025-10-08 10:31:59.775427+05:30	5485f417-e18a-4915-807e-168220a1a555	aliva pradhan	business	aliva@gmail.com	9776236519	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAT5000A1Z0	\N	t	0.00	{}	\N
3612302f-9c15-4eb1-b6c2-c3b413a5f4ec	2025-10-08 10:32:54.559446+05:30	2025-10-08 10:32:54.559446+05:30	5485f417-e18a-4915-807e-168220a1a555	biswabandita moharana	business	biswabandita@gmail.com	9776236654	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAS4000A1Z0	\N	t	0.00	{}	\N
e063016e-44a2-4d0e-8359-e1918c74c3d1	2025-10-08 11:14:18.018165+05:30	2025-10-08 11:14:18.018165+05:30	5485f417-e18a-4915-807e-168220a1a555	Ratikant Pradhan	business	ratikant@gmail.com	8976543670	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAG5000A1Z7	\N	t	0.00	{}	\N
8b4d4f90-8b70-4607-b27c-cc0c08c04479	2025-10-08 11:20:42.246649+05:30	2025-10-08 11:21:02.233349+05:30	5485f417-e18a-4915-807e-168220a1a555	Ashwin Rout	business	ashwin@gmail.com	9556553258	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAR5600A1Z0	\N	t	0.00	{}	\N
361cc52b-4713-4230-99af-ec691ec01d53	2025-10-07 14:45:37.437401+05:30	2025-10-08 11:31:32.943164+05:30	5485f417-e18a-4915-807e-168220a1a555	Abhinash Pattnaik	business	abhinash@gmail.com	9778263519	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAA0000A1Z0	\N	t	189.00	{}	\N
c25f0f4d-5959-4a15-8f55-c447c2f67577	2025-10-08 11:20:03.105559+05:30	2025-10-08 11:32:03.934084+05:30	5485f417-e18a-4915-807e-168220a1a555	anup mohanty	business	anup@gmail.com	9856231470	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "state": "odisha", "country": "India", "pincode": "754108"}	22AAAAF2000A1Z0	\N	t	10500.00	{}	\N
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
1.00	\N	120.00	8.00	9.60	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	275d8923-d08c-4815-b5ef-2d0069d6cb80	5b7e6fd2-e59e-48a4-bb42-1a8326b1013b	0.00	0.00	129.60	\N	7d754ddc-2eb2-4a21-a7c0-33d6af7b0fb7	2025-09-20 16:01:42.760783+05:30	2025-09-20 16:01:42.760783+05:30	cashews	23
1.00	\N	120.00	8.00	9.60	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	77caf6a6-c5e9-495d-b7ab-7b5fb0ee8081	5b7e6fd2-e59e-48a4-bb42-1a8326b1013b	0.00	0.00	129.60	\N	95f4fa0b-b11b-4a9f-9e75-f678304b1cec	2025-09-22 18:15:53.750744+05:30	2025-09-22 18:15:53.750744+05:30	cashews	23
1.00	\N	120.00	8.00	9.60	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	614f224b-5e21-44f2-8886-a510bc76d948	5b7e6fd2-e59e-48a4-bb42-1a8326b1013b	0.00	0.00	129.60	\N	4c8a372c-fa3b-40e9-962c-b045f585c425	2025-09-30 15:21:28.399698+05:30	2025-09-30 15:21:28.399698+05:30	cashews	23
1.00	\N	120.00	8.00	9.60	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	d8cb8792-d7c6-4339-8f8c-e92b0b7c5127	5b7e6fd2-e59e-48a4-bb42-1a8326b1013b	0.00	0.00	129.60	\N	1ce47f3f-a7f9-47b2-965a-2c3625fe5a2e	2025-09-30 15:27:39.310919+05:30	2025-09-30 15:27:39.310919+05:30	cashews	23
1.00	\N	120.00	8.00	9.60	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	76ac9f42-203b-418f-a9f8-dc7624ce5e53	5b7e6fd2-e59e-48a4-bb42-1a8326b1013b	0.00	0.00	129.60	\N	5620a0a3-90f9-4ae8-b80b-ceb548706a01	2025-10-03 19:29:43.892577+05:30	2025-10-03 19:29:43.892577+05:30	cashews	23
1.00	\N	120.00	8.00	9.60	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	a24392b9-a452-43f7-9bf6-aee7fff3bb7b	5b7e6fd2-e59e-48a4-bb42-1a8326b1013b	0.00	0.00	129.60	\N	6f07ac0e-36e3-4edf-8951-8613b60168c3	2025-10-03 19:31:05.32263+05:30	2025-10-03 19:31:05.32263+05:30	cashews	23
1.00	\N	120.00	8.00	9.60	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	2a0f6110-e341-4e73-87ec-72c550d3a037	5b7e6fd2-e59e-48a4-bb42-1a8326b1013b	0.00	0.00	129.60	\N	ff77f738-9bb7-4d58-b5e5-71ed9e91c2e1	2025-10-07 18:27:56.130725+05:30	2025-10-07 18:27:56.130725+05:30	cashews	23
1.00	\N	180.00	5.00	9.00	5485f417-e18a-4915-807e-168220a1a555	b21cc1d1-ea57-4260-890d-0f3937a96c32	4fa5dbe1-7238-4a17-9f20-b4c3b572450b	0.00	0.00	189.00	\N	bcdd6589-3cda-4e34-851e-ee1325801a66	2025-10-08 11:31:32.943164+05:30	2025-10-08 11:31:32.943164+05:30	mouse	pcs
2.00	\N	5000.00	5.00	500.00	5485f417-e18a-4915-807e-168220a1a555	eb4bbfc1-f1a7-4c12-8759-87f72f207a30	d63a4d5c-aebe-47ec-a043-25a984e92c33	0.00	0.00	10500.00	\N	ec9102a0-10b3-48df-a269-33afe579f715	2025-10-08 11:32:03.934084+05:30	2025-10-08 11:32:03.934084+05:30	Harddisk	pcs
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, "createdAt", "updatedAt", "tenantId", "invoiceNumber", type, status, "customerId", "issueDate", "dueDate", "paidDate", "paymentTerms", "shippingAddress", "billingAddress", "termsAndConditions", notes, "subTotal", "taxTotal", "discountTotal", "totalAmount", "amountPaid", "balanceDue", "discountDetails", "isRecurring", "recurringSettings", "sentAt", "viewedAt", "deletedAt", "gstinId", "subscriptionId", metadata) FROM stdin;
275d8923-d08c-4815-b5ef-2d0069d6cb80	2025-09-20 16:01:15.526381+05:30	2025-09-20 16:07:17.654606+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	INV-dae9-1758364275680-340	proforma	draft	ea71e4ff-0407-4fec-bb92-969e8a7183f7	2025-09-20	2025-10-05	\N	net_15					120.00	9.60	0.00	129.60	0.00	129.60	[]	f	\N	\N	\N	2025-09-20 16:07:17.797	\N	\N	\N
77caf6a6-c5e9-495d-b7ab-7b5fb0ee8081	2025-09-22 17:39:03.515444+05:30	2025-09-22 18:15:53.750744+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	INV-dae9-1758542943618-912	credit	draft	21de7ab7-b330-431a-a4b4-a6627fd1964a	2025-09-22	2025-10-07	\N	net_15	sangrampur	bhubaneswar	no return	ok	120.00	9.60	0.00	129.60	0.00	129.60	[]	f	\N	\N	\N	\N	\N	\N	\N
48c24295-cd71-460e-9509-9b0410fc9bd5	2025-09-30 13:15:44.283066+05:30	2025-09-30 13:15:44.283066+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	INV-dae9-1759218344433-370	proforma	draft	b12305fa-8797-47ae-8277-7a9c1a6510ae	2025-09-30	2025-10-15	\N	net_15	sangrampur	bhubaneswar	no return	okk	120.00	9.60	0.00	129.60	0.00	129.60	[]	f	\N	\N	\N	\N	\N	\N	\N
2a0f6110-e341-4e73-87ec-72c550d3a037	2025-09-18 12:27:43.480671+05:30	2025-10-07 18:27:56.130725+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	INV-dae9-1758178663673-679	proforma	draft	797606b1-9f49-430d-b26e-c80cb8cf3abe	2025-09-17	2025-10-02	\N	net_15	sangrampur	bhubaneswar	no return	okk	120.00	9.60	0.00	129.60	0.00	129.60	[]	f	\N	\N	\N	\N	\N	\N	\N
b21cc1d1-ea57-4260-890d-0f3937a96c32	2025-10-07 15:40:34.396413+05:30	2025-10-08 11:31:32.943164+05:30	5485f417-e18a-4915-807e-168220a1a555	INV-a555-1759831834477-723	proforma	draft	361cc52b-4713-4230-99af-ec691ec01d53	2025-10-07	2025-10-22	\N	net_15	sangrampur	bhubaneswar	no return	okk	180.00	9.00	0.00	189.00	0.00	189.00	[]	f	\N	\N	\N	\N	\N	\N	\N
eb4bbfc1-f1a7-4c12-8759-87f72f207a30	2025-10-08 11:31:58.234997+05:30	2025-10-08 11:32:03.934084+05:30	5485f417-e18a-4915-807e-168220a1a555	INV-a555-1759903318237-940	standard	draft	c25f0f4d-5959-4a15-8f55-c447c2f67577	2025-10-08	2025-10-23	\N	net_15	sangrampur	bhubaneswar	no return	werfqwreaaa	10000.00	500.00	0.00	10500.00	0.00	10500.00	[]	f	\N	\N	\N	\N	\N	\N	\N
614f224b-5e21-44f2-8886-a510bc76d948	2025-09-30 14:46:46.835181+05:30	2025-09-30 15:21:28.399698+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	INV-dae9-1759223806933-719	standard	draft	531c85c3-2498-4c25-8b28-9c6bac7adc20	2025-09-30	2025-10-07	\N	net_7					120.00	9.60	0.00	129.60	0.00	129.60	[]	f	\N	\N	\N	\N	\N	\N	\N
d8cb8792-d7c6-4339-8f8c-e92b0b7c5127	2025-09-30 15:25:54.327801+05:30	2025-09-30 15:27:39.310919+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	INV-dae9-1759226154523-786	standard	draft	10456dd9-70b1-4a5c-9b46-44e4f93f6e8b	2025-09-30	2025-10-15	\N	net_15	sangrampur	bhubaneswar	no return	okk	120.00	9.60	0.00	129.60	0.00	129.60	[]	f	\N	\N	\N	\N	\N	\N	\N
76ac9f42-203b-418f-a9f8-dc7624ce5e53	2025-10-03 16:28:11.659301+05:30	2025-10-03 19:29:43.892577+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	INV-dae9-1759489091756-432	standard	draft	874ba8d4-56bb-4c5c-abae-f2e8efac5182	2025-10-01	2025-10-16	\N	net_15	sangrampur	bhubaneswar	no return	okk	120.00	9.60	0.00	129.60	0.00	129.60	[]	f	\N	\N	\N	\N	\N	\N	\N
a24392b9-a452-43f7-9bf6-aee7fff3bb7b	2025-10-03 19:31:05.32263+05:30	2025-10-03 19:31:05.32263+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	INV-dae9-1759500065418-342	standard	draft	b7f66a9a-bd0f-4619-8362-447a2cad766e	2025-10-03	2025-10-18	\N	net_15	sangrampur	bhubaneswar	no return	werfqwre	120.00	9.60	0.00	129.60	0.00	129.60	[]	f	\N	\N	\N	\N	\N	\N	\N
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
ff35011d-03f6-47be-98d5-5808988185c6	2025-09-30 13:15:45.546644+05:30	2025-09-30 13:15:45.546644+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	b12305fa-8797-47ae-8277-7a9c1a6510ae	48c24295-cd71-460e-9509-9b0410fc9bd5	\N	earn	completed	0	6.48	129.60	Cashback earned on invoice INV-dae9-1759218344433-370	\N	\N	5.00
4d9668dc-2c04-413b-a17f-3114d36c09f4	2025-09-30 14:46:48.145584+05:30	2025-09-30 14:46:48.145584+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	531c85c3-2498-4c25-8b28-9c6bac7adc20	614f224b-5e21-44f2-8886-a510bc76d948	\N	earn	completed	0	6.48	129.60	Cashback earned on invoice INV-dae9-1759223806933-719	\N	\N	5.00
dda76c3f-35f7-4c6b-b0d5-5c47995771d0	2025-09-30 15:25:55.576906+05:30	2025-09-30 15:25:55.576906+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	10456dd9-70b1-4a5c-9b46-44e4f93f6e8b	d8cb8792-d7c6-4339-8f8c-e92b0b7c5127	\N	earn	completed	0	6.48	129.60	Cashback earned on invoice INV-dae9-1759226154523-786	\N	\N	5.00
6d36a163-185f-40fe-af45-566d0ceea0ec	2025-10-03 16:28:12.840811+05:30	2025-10-03 16:28:12.840811+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	874ba8d4-56bb-4c5c-abae-f2e8efac5182	76ac9f42-203b-418f-a9f8-dc7624ce5e53	\N	earn	completed	0	6.48	129.60	Cashback earned on invoice INV-dae9-1759489091756-432	\N	\N	5.00
bc0eb158-46c6-4f5e-878d-622a58afc8d7	2025-10-03 18:21:39.183465+05:30	2025-10-03 18:21:39.183465+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	874ba8d4-56bb-4c5c-abae-f2e8efac5182	76ac9f42-203b-418f-a9f8-dc7624ce5e53	\N	earn	completed	0	6.48	NaN	Cashback earned on invoice INV-dae9-1759489091756-432	\N	\N	5.00
ed421a6b-cece-4620-813e-5d671804237b	2025-10-03 18:52:08.307945+05:30	2025-10-03 18:52:08.307945+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	874ba8d4-56bb-4c5c-abae-f2e8efac5182	76ac9f42-203b-418f-a9f8-dc7624ce5e53	\N	earn	completed	0	6.48	NaN	Cashback earned on invoice INV-dae9-1759489091756-432	\N	\N	5.00
013a9f7b-800a-447e-af51-7204f93fe393	2025-10-03 19:04:48.192367+05:30	2025-10-03 19:04:48.192367+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	874ba8d4-56bb-4c5c-abae-f2e8efac5182	76ac9f42-203b-418f-a9f8-dc7624ce5e53	\N	earn	completed	0	6.48	NaN	Cashback earned on invoice INV-dae9-1759489091756-432	\N	\N	5.00
16f113bd-f793-4e23-a1e2-2669dd9670dc	2025-10-03 19:05:18.129346+05:30	2025-10-03 19:05:18.129346+05:30	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	874ba8d4-56bb-4c5c-abae-f2e8efac5182	76ac9f42-203b-418f-a9f8-dc7624ce5e53	\N	earn	completed	0	6.48	NaN	Cashback earned on invoice INV-dae9-1759489091756-432	\N	\N	5.00
dba78ab5-4dab-468b-b6b3-660d70c2da71	2025-10-08 11:32:00.27758+05:30	2025-10-08 11:32:00.27758+05:30	5485f417-e18a-4915-807e-168220a1a555	c25f0f4d-5959-4a15-8f55-c447c2f67577	eb4bbfc1-f1a7-4c12-8759-87f72f207a30	\N	earn	completed	0	525.00	10500.00	Cashback earned on invoice INV-a555-1759903318237-940	\N	\N	5.00
45e2068b-8188-4497-b742-3160a98726f3	2025-10-08 11:32:06.020102+05:30	2025-10-08 11:32:06.020102+05:30	5485f417-e18a-4915-807e-168220a1a555	c25f0f4d-5959-4a15-8f55-c447c2f67577	eb4bbfc1-f1a7-4c12-8759-87f72f207a30	\N	earn	completed	0	525.00	10500.00	Cashback earned on invoice INV-a555-1759903318237-940	\N	\N	5.00
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

COPY public.payments (id, "createdAt", "updatedAt", "tenantId", amount, method, status, notes, "deletedAt", "subscriptionId", "professionalId", currency, "gatewayPaymentId", "gatewayOrderId", "gatewayResponse", receipt, "refundDetails", "refundedAt", "paymentDate", "invoiceId") FROM stdin;
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
Student Utility	goods	{}	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	68518bac-09c5-48a6-938c-5973627c91a4	2025-10-04 18:12:39.051909+05:30	2025-10-04 18:12:39.051909+05:30	5678	120.00	320.00	20.00	5.00	in_stock	pcs	5.00	a44af56b-7e38-4998-adc6-d2f6c4d3ada8	\N	t	\N	\N	Casio Calculator	98765
Student Utility	goods	{}	5485f417-e18a-4915-807e-168220a1a555	ce2921f7-c6cc-4787-b70f-64bd68b4af1d	2025-10-04 18:17:59.535969+05:30	2025-10-04 18:17:59.535969+05:30	12358	150.00	250.00	30.00	5.00	in_stock	pcs	8.00	86a54e38-a05f-425e-809d-cb897c416675	\N	t	\N	\N	Keyboard	78945
Student Utility	goods	{}	5485f417-e18a-4915-807e-168220a1a555	9da3d568-30d2-4cc3-bbf1-8b5a2c4c4790	2025-10-07 11:38:18.893383+05:30	2025-10-07 11:39:36.642276+05:30	123582	6000.00	8000.00	25.00	5.00	in_stock	pcs	5.00	86a54e38-a05f-425e-809d-cb897c416675	\N	t	\N	\N	Monitor	978532
Student Utility	goods	{}	5485f417-e18a-4915-807e-168220a1a555	4fa5dbe1-7238-4a17-9f20-b4c3b572450b	2025-10-07 11:10:47.520496+05:30	2025-10-08 11:31:32.943164+05:30	334673	100.00	180.00	23.00	5.00	in_stock	pcs	5.00	86a54e38-a05f-425e-809d-cb897c416675	\N	t	\N	\N	mouse	978534
Student Utility	goods	{}	5485f417-e18a-4915-807e-168220a1a555	d63a4d5c-aebe-47ec-a043-25a984e92c33	2025-10-08 11:30:12.552201+05:30	2025-10-08 11:32:03.934084+05:30	123532	2000.00	5000.00	19.00	6.00	in_stock	pcs	5.00	86a54e38-a05f-425e-809d-cb897c416675	\N	t	\N	\N	Harddisk	978522
\.


--
-- Data for Name: professional_tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professional_tenants (id, "professionalId", "tenantId", "specificPermissions", "isActive", "assignedAt") FROM stdin;
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

COPY public.subscription_plans (id, "createdAt", "updatedAt", name, "planType", "billingPeriod", price, currency, features, limits, "isActive", "isDefault", description, "trialDays") FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (id, "createdAt", "updatedAt", "tenantId", "planId", "professionalId", status, amount, currency, "startDate", "endDate", "cancelledAt", "trialEndsAt", "paymentGateway", "paymentGatewayId", "paymentGatewaySubscriptionId", "paymentDetails", metadata, "autoRenew", "nextBillingDate", "cancelAtPeriodEnd") FROM stdin;
\.


--
-- Data for Name: super_admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.super_admin (id, "userId", first_name, last_name, email, password_hash, is_active, permissions, "createdAt", "updatedAt") FROM stdin;
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
abcba6c5-35bd-477e-9e9a-ec76f1c988b9	Tax 8%	8.00	9.60	120.00	48c24295-cd71-460e-9509-9b0410fc9bd5	2025-09-30 13:15:44.283066	2025-09-30 13:15:44.283066
d22b87b1-3fe2-4846-879e-185db6781cba	Tax 8%	8.00	9.60	120.00	614f224b-5e21-44f2-8886-a510bc76d948	2025-09-30 14:46:46.835	2025-09-30 14:46:46.835
c2767068-9730-41f4-be83-191170fb50bc	Tax 8%	8.00	9.60	120.00	614f224b-5e21-44f2-8886-a510bc76d948	2025-09-30 15:21:28.399698	2025-09-30 15:21:28.399698
9c1fd939-e179-4f38-ac63-f597211d2c50	Tax 8%	8.00	9.60	120.00	d8cb8792-d7c6-4339-8f8c-e92b0b7c5127	2025-09-30 15:25:54.327	2025-09-30 15:25:54.327
7443d063-c862-44eb-883f-7b9fb843ea38	Tax 8%	8.00	9.60	120.00	d8cb8792-d7c6-4339-8f8c-e92b0b7c5127	2025-09-30 15:27:39.310919	2025-09-30 15:27:39.310919
f2c844f3-d01a-4d40-a370-2e35c38aadc9	Tax 8%	8.00	9.60	120.00	76ac9f42-203b-418f-a9f8-dc7624ce5e53	2025-10-03 16:28:11.659	2025-10-03 16:28:11.659
693d3890-1e48-4a0c-9d8d-7de6492527ac	Tax 8%	8.00	9.60	120.00	76ac9f42-203b-418f-a9f8-dc7624ce5e53	2025-10-03 16:29:17.126	2025-10-03 16:29:17.126
30d3413b-b228-46e8-8f76-05aeb82e8349	Tax 8%	8.00	9.60	120.00	76ac9f42-203b-418f-a9f8-dc7624ce5e53	2025-10-03 17:43:11.955	2025-10-03 17:43:11.955
a0a3302e-15c2-4258-86a9-d0c8b91fea6d	Tax 8%	8.00	9.60	120.00	76ac9f42-203b-418f-a9f8-dc7624ce5e53	2025-10-03 18:02:20.321	2025-10-03 18:02:20.321
3122bd9a-3772-4fc7-a750-cb99cc33bbf7	Tax 8%	8.00	9.60	120.00	76ac9f42-203b-418f-a9f8-dc7624ce5e53	2025-10-03 18:21:38.049	2025-10-03 18:21:38.049
5c52cf3c-180b-4388-a452-e296b655b987	Tax 8%	8.00	9.60	120.00	76ac9f42-203b-418f-a9f8-dc7624ce5e53	2025-10-03 18:52:06.161	2025-10-03 18:52:06.161
b0f4e7e1-1fd4-4eb4-b9ae-9942569c40bb	Tax 8%	8.00	9.60	120.00	76ac9f42-203b-418f-a9f8-dc7624ce5e53	2025-10-03 19:04:46.014	2025-10-03 19:04:46.014
749d5861-6d04-444c-9f77-ba9cff151e32	Tax 8%	8.00	9.60	120.00	76ac9f42-203b-418f-a9f8-dc7624ce5e53	2025-10-03 19:05:16.008	2025-10-03 19:05:16.008
c73db50d-09e4-4671-b0dc-d37611f04ba6	Tax 8%	8.00	9.60	120.00	76ac9f42-203b-418f-a9f8-dc7624ce5e53	2025-10-03 19:29:43.892577	2025-10-03 19:29:43.892577
80c2ced2-176c-4e6a-ab9c-f852a31568a0	Tax 8%	8.00	9.60	120.00	a24392b9-a452-43f7-9bf6-aee7fff3bb7b	2025-10-03 19:31:05.32263	2025-10-03 19:31:05.32263
7298b2fc-50a9-4d81-9a3c-01cc1d5b7b70	Tax 8%	8.00	9.60	120.00	2a0f6110-e341-4e73-87ec-72c550d3a037	2025-10-07 18:27:56.130725	2025-10-07 18:27:56.130725
3ad3e26a-dd7c-4bc4-a38d-47ba82f432b6	Tax 5%	5.00	9.00	180.00	b21cc1d1-ea57-4260-890d-0f3937a96c32	2025-10-07 15:40:34.396	2025-10-07 15:40:34.396
7c05272f-d34a-4570-9145-85c9e342fb0f	Tax 5%	5.00	9.00	180.00	b21cc1d1-ea57-4260-890d-0f3937a96c32	2025-10-08 11:31:32.943164	2025-10-08 11:31:32.943164
ce5c1dc6-4403-4b76-a439-8f3d4ca7c6f9	Tax 5%	5.00	500.00	10000.00	eb4bbfc1-f1a7-4c12-8759-87f72f207a30	2025-10-08 11:31:58.234	2025-10-08 11:31:58.234
ea723d0b-69d6-4f82-a73b-fe5484a0fecd	Tax 5%	5.00	500.00	10000.00	eb4bbfc1-f1a7-4c12-8759-87f72f207a30	2025-10-08 11:32:03.934084	2025-10-08 11:32:03.934084
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
a1ac7272-dbda-4da5-b939-9b0ed8a12ebd	admin@demo.com	$2a$12$zh.XxZ0laigIHUWpnba/fO3lQ9v4fql7WQpnEFygWOFu/t9nZSibC	Admin	User	\N	f	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	active	2025-09-09 10:51:49.018665+05:30	2025-10-08 12:03:44.390283+05:30	2025-10-08 12:03:44.386	admin
e55e49de-1358-43f5-a535-9fd593e72bf0	monalisa@gmail.com	$2a$12$zh.XxZ0laigIHUWpnba/fO3lQ9v4fql7WQpnEFygWOFu/t9nZSibC	Monalisa	Pradhan	\N	f	5485f417-e18a-4915-807e-168220a1a555	active	2025-09-18 16:04:33.148586+05:30	2025-10-08 12:04:03.986353+05:30	2025-10-08 12:04:03.982	admin
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
f651c95e-df21-4c77-8df3-2a1b75ada149	e2cabb80-a8ce-4fe8-947e-5c18d903dae9	saumya	saumyajiku229@gmail.com	9776236509	21AAAAA0000A1Z5	ABCDE1234F	t	contractor	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	401.76	30	\N	{}	2025-09-16 19:24:19.740718+05:30	2025-09-20 15:09:01.103962+05:30
a692bc35-1b72-40ad-bdd1-7d02fdbcdb42	5485f417-e18a-4915-807e-168220a1a555	Ekart	ekart@gmail.com	9776236530	21AAATY5000A1Z5	ABCDE1236Y	t	service_provider	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	0.00	30	\N	{}	2025-10-08 11:22:16.448026+05:30	2025-10-08 11:22:16.448026+05:30
0bde0d95-5bf3-4f7a-9b5c-cc970cbcfe62	5485f417-e18a-4915-807e-168220a1a555	Blinkit	blinkit@gmail.com	9885623014	21AAAAA0110A1Z5	ABCDE3436Y	t	service_provider	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	{"city": "jagatsinghapur", "line1": "sangrampur", "line2": "bhubaneswar", "state": "odisha", "country": "India", "postalCode": "754108"}	2100.00	30	\N	{}	2025-10-08 11:28:51.53312+05:30	2025-10-08 11:30:50.154602+05:30
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
-- Name: IDX_3e9d388c10c2c52e89f65c60d5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3e9d388c10c2c52e89f65c60d5" ON public.product_tax_rates USING btree (tax_rate_id);


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
    ADD CONSTRAINT "FK_0c5fe8e5f9f4dd4a8c0134abc9c" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


--
-- Name: purchase_order FK_0cfd30f4aadb68debc6a32554c1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT "FK_0cfd30f4aadb68debc6a32554c1" FOREIGN KEY ("vendorId") REFERENCES public.vendors(id);


--
-- Name: tenant_subscription FK_0edb3690c9bf622820ca13d04e4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_subscription
    ADD CONSTRAINT "FK_0edb3690c9bf622820ca13d04e4" FOREIGN KEY ("paidByProfessionalId") REFERENCES public.professional_users(id);


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
-- Name: subscription_changes FK_1c4dda5448fa138e42bb8bff0ba; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_changes
    ADD CONSTRAINT "FK_1c4dda5448fa138e42bb8bff0ba" FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) ON DELETE CASCADE;


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
-- Name: subscriptions FK_30064e5ecc06363024ba8258fd4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT "FK_30064e5ecc06363024ba8258fd4" FOREIGN KEY ("professionalId") REFERENCES public.professional_users(id);


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
-- Name: payments FK_98a04cdcbac4f6a2c55c7d19350; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_98a04cdcbac4f6a2c55c7d19350" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


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
    ADD CONSTRAINT "FK_a874eb4a7945f64df2ad13993f0" FOREIGN KEY ("professionalId") REFERENCES public.professional_users(id);


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
-- Name: expenses FK_f754faa125acaf008866b6635bc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT "FK_f754faa125acaf008866b6635bc" FOREIGN KEY ("tenantId") REFERENCES public.tenant(id);


--
-- Name: payments FK_f7f648bac8bc570918892da5613; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_f7f648bac8bc570918892da5613" FOREIGN KEY ("professionalId") REFERENCES public.professional_users(id);


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

\unrestrict LxdvkgP6Lqo9QyztCggndy6hKLbAc5vu5aZkwPYyJ2L0pueFRnszfzvfgwmenXW

