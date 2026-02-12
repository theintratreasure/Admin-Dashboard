"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  UserPlus,
  User,
  Mail,
  Phone,
  KeyRound,
  ShieldCheck,
  Calendar,
  MapPin,
  Globe,
  Building2,
  Hash,
  ChevronDown,
  Sparkles,
  Loader2,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Toggle from "@/app/admin/components/ui/Toggle";
import { useCreateAdminUser } from "@/hooks/useCreateAdminUser";

type KycStatus = "NOT_STARTED" | "PENDING" | "VERIFIED" | "REJECTED";
type Gender = "MALE" | "FEMALE" | "OTHER";

type CreateUserFormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  isMailVerified: boolean;
  kycStatus: KycStatus;
  profile: {
    date_of_birth: string;
    gender: Gender;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
};

const KYC_OPTIONS: Array<{ value: KycStatus; label: string }> = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "PENDING", label: "Pending" },
  { value: "VERIFIED", label: "Verified" },
  { value: "REJECTED", label: "Rejected" },
];

const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null) {
    const messageFromServer = (
      error as { response?: { data?: { message?: string } } }
    ).response?.data?.message;
    if (messageFromServer) return messageFromServer;
  }

  if (error instanceof Error && error.message) return error.message;

  return fallback;
};

export default function CreateUserPage() {
  const router = useRouter();
  const createUser = useCreateAdminUser();

  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState<CreateUserFormState>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isMailVerified: true,
    kycStatus: "NOT_STARTED",
    profile: {
      date_of_birth: "",
      gender: "MALE",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
  });

  const updateField = <K extends keyof CreateUserFormState>(
    key: K,
    value: CreateUserFormState[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateProfileField = <K extends keyof CreateUserFormState["profile"]>(
    key: K,
    value: CreateUserFormState["profile"][K]
  ) => {
    setForm((previous) => ({
      ...previous,
      profile: {
        ...previous.profile,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!name) return setSubmitError("Name is required.");
    if (!email) return setSubmitError("Email is required.");
    if (!phone) return setSubmitError("Phone is required.");
    if (!password) return setSubmitError("Password is required.");
    if (password.length < 8)
      return setSubmitError("Password must be at least 8 characters.");
    if (password !== confirmPassword)
      return setSubmitError("Password and confirm password do not match.");

    const dateOfBirth = form.profile.date_of_birth.trim();
    const addressLine1 = form.profile.address_line_1.trim();
    const city = form.profile.city.trim();
    const state = form.profile.state.trim();
    const country = form.profile.country.trim();
    const pincode = form.profile.pincode.trim();

    if (!dateOfBirth) return setSubmitError("Date of birth is required.");
    if (!addressLine1) return setSubmitError("Address line 1 is required.");
    if (!city) return setSubmitError("City is required.");
    if (!state) return setSubmitError("State is required.");
    if (!country) return setSubmitError("Country is required.");
    if (!pincode) return setSubmitError("Pincode is required.");

    try {
      const response = await createUser.mutateAsync({
        name,
        email,
        phone,
        password,
        confirmPassword,
        isMailVerified: Boolean(form.isMailVerified),
        kycStatus: form.kycStatus,
        profile: {
          date_of_birth: dateOfBirth,
          gender: form.profile.gender,
          address_line_1: addressLine1,
          address_line_2: form.profile.address_line_2 ?? "",
          city,
          state,
          country,
          pincode,
        },
      });

      const message =
        response.data?.message || response.message || "User created successfully.";
      toast.success(message);

      const userId = response.data?.user_id;
      if (userId) {
        router.push(`/admin/users/users/view/${userId}`);
        return;
      }

      router.push("/admin/users/users");
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Unable to create user.");
      setSubmitError(message);
      toast.error(message);
    }
  };

  return (
    <div className="container-pad">
      <div className="mx-auto w-full max-w-4xl space-y-4 pb-28 text-[var(--foreground)]">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Header */}
        <div className="rounded-2xl border border-[var(--card-border)] bg-gradient-to-br from-[var(--card-bg)] via-[var(--card-bg)] to-sky-500/5 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-700">
                <UserPlus size={18} />
              </span>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                  <Sparkles size={12} />
                  User Management
                </div>
                <h1 className="mt-2 text-lg sm:text-2xl font-semibold">
                  Create User
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[var(--text-muted)]">
                  Add a new user with verification and profile details.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          id="create-user-form"
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-violet-500/10" />

          <div className="relative space-y-4 p-4 sm:p-6">
          {submitError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-800 dark:text-rose-200">
              <div className="flex items-start gap-2">
                <XCircle size={18} className="mt-0.5 shrink-0" />
                <span>{submitError}</span>
              </div>
            </div>
          )}

          <FormSection
            title="Account"
            description="Basic details used for login and contact."
            icon={User}
          >
            <InputField
              id="name"
              label="Name"
              icon={User}
              required
              value={form.name}
              onChange={(v) => updateField("name", v)}
              placeholder="Super Admin"
              disabled={createUser.isPending}
              autoComplete="name"
            />

            <InputField
              id="email"
              label="Email"
              icon={Mail}
              required
              type="email"
              value={form.email}
              onChange={(v) => updateField("email", v)}
              placeholder="admin@test.com"
              disabled={createUser.isPending}
              autoComplete="email"
            />

            <div className="md:col-span-2">
              <InputField
                id="phone"
                label="Phone"
                icon={Phone}
                required
                type="tel"
                value={form.phone}
                onChange={(v) => updateField("phone", v)}
                placeholder="+923001234567"
                disabled={createUser.isPending}
                autoComplete="tel"
              />
            </div>
          </FormSection>

          <FormSection
            title="Security"
            description="Set a strong password for the new user."
            icon={KeyRound}
          >
            <InputField
              id="password"
              label="Password"
              icon={KeyRound}
              required
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(v) => updateField("password", v)}
              placeholder="********"
              disabled={createUser.isPending}
              autoComplete="new-password"
              hint="Minimum 8 characters."
              right={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-[var(--text-muted)] hover:text-[var(--foreground)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <InputField
              id="confirmPassword"
              label="Confirm Password"
              icon={KeyRound}
              required
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(v) => updateField("confirmPassword", v)}
              placeholder="********"
              disabled={createUser.isPending}
              autoComplete="new-password"
              right={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="text-[var(--text-muted)] hover:text-[var(--foreground)]"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </FormSection>

          <FormSection
            title="Verification"
            description="Configure verification and KYC status."
            icon={ShieldCheck}
          >
            <div className="md:col-span-2">
              <div
                className={`rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2.5 ${
                  createUser.isPending ? "opacity-70 pointer-events-none" : ""
                }`}
              >
                <Toggle
                  label={
                    <span className="inline-flex items-center gap-2 font-medium">
                      <Mail size={14} className="text-[var(--text-muted)]" />
                      Mail Verified
                    </span>
                  }
                  value={form.isMailVerified}
                  onChange={(value) => updateField("isMailVerified", value)}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <SelectField
                id="kycStatus"
                label="KYC Status"
                icon={ShieldCheck}
                required
                value={form.kycStatus}
                onChange={(v) => updateField("kycStatus", v as KycStatus)}
                disabled={createUser.isPending}
                options={KYC_OPTIONS}
              />
            </div>
          </FormSection>

          <FormSection
            title="Profile"
            description="Personal information and address."
            icon={MapPin}
          >
            <InputField
              id="date_of_birth"
              label="Date of Birth"
              icon={Calendar}
              required
              type="date"
              value={form.profile.date_of_birth}
              onChange={(v) => updateProfileField("date_of_birth", v)}
              disabled={createUser.isPending}
            />

            <SelectField
              id="gender"
              label="Gender"
              icon={User}
              required
              value={form.profile.gender}
              onChange={(v) => updateProfileField("gender", v as Gender)}
              disabled={createUser.isPending}
              options={GENDER_OPTIONS}
            />

            <div className="md:col-span-2">
              <InputField
                id="address_line_1"
                label="Address Line 1"
                icon={MapPin}
                required
                value={form.profile.address_line_1}
                onChange={(v) => updateProfileField("address_line_1", v)}
                placeholder="House 10"
                disabled={createUser.isPending}
                autoComplete="address-line1"
              />
            </div>

            <div className="md:col-span-2">
              <InputField
                id="address_line_2"
                label="Address Line 2 (optional)"
                icon={MapPin}
                value={form.profile.address_line_2}
                onChange={(v) => updateProfileField("address_line_2", v)}
                placeholder=""
                disabled={createUser.isPending}
                autoComplete="address-line2"
              />
            </div>

            <InputField
              id="city"
              label="City"
              icon={Building2}
              required
              value={form.profile.city}
              onChange={(v) => updateProfileField("city", v)}
              placeholder="Lahore"
              disabled={createUser.isPending}
              autoComplete="address-level2"
            />

            <InputField
              id="state"
              label="State"
              icon={MapPin}
              required
              value={form.profile.state}
              onChange={(v) => updateProfileField("state", v)}
              placeholder="Punjab"
              disabled={createUser.isPending}
              autoComplete="address-level1"
            />

            <InputField
              id="country"
              label="Country"
              icon={Globe}
              required
              value={form.profile.country}
              onChange={(v) => updateProfileField("country", v)}
              placeholder="UK"
              disabled={createUser.isPending}
              autoComplete="country"
            />

            <InputField
              id="pincode"
              label="Pincode"
              icon={Hash}
              required
              value={form.profile.pincode}
              onChange={(v) => updateProfileField("pincode", v)}
              placeholder="54000"
              disabled={createUser.isPending}
              autoComplete="postal-code"
            />
          </FormSection>

          <div className="hidden md:flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--hover-bg)]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createUser.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {createUser.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create User
                </>
              )}
            </button>
          </div>
        </div>
        </form>

        {/* Mobile sticky action */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--card-border)] bg-[var(--card-bg)]/90 backdrop-blur md:hidden">
          <div className="mx-auto max-w-4xl px-[18px] py-3">
            <button
              type="submit"
              form="create-user-form"
              disabled={createUser.isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {createUser.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create User
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/70 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-muted)]">
          <Icon size={18} />
        </span>

        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-semibold text-[var(--foreground)]">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function InputField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  required,
  disabled,
  hint,
  right,
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "password" | "date";
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  right?: ReactNode;
}) {
  return (
    <div className="w-full space-y-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-[var(--text-muted)]"
      >
        {label}
        {required && <span className="ml-1 text-[var(--danger)]">*</span>}
      </label>

      <div
        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 transition
          bg-[var(--input-bg)] border-[var(--input-border)]
          focus-within:border-[var(--primary)]
          focus-within:shadow-[0_0_0_3px_var(--glow)]
          ${disabled ? "opacity-70" : ""}`}
      >
        <Icon size={18} className="shrink-0 text-[var(--text-muted)]" />
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed"
        />
        {right}
      </div>

      {hint && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}

function SelectField<T extends string>({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  options,
  required,
  disabled,
  hint,
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div className="w-full space-y-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-[var(--text-muted)]"
      >
        {label}
        {required && <span className="ml-1 text-[var(--danger)]">*</span>}
      </label>

      <div
        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 transition
          bg-[var(--input-bg)] border-[var(--input-border)]
          focus-within:border-[var(--primary)]
          focus-within:shadow-[0_0_0_3px_var(--glow)]
          ${disabled ? "opacity-70" : ""}`}
      >
        <Icon size={18} className="shrink-0 text-[var(--text-muted)]" />
        <select
          id={id}
          name={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full flex-1 appearance-none bg-transparent text-sm text-[var(--foreground)] outline-none disabled:cursor-not-allowed"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="text-[var(--text-muted)]" />
      </div>

      {hint && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}
