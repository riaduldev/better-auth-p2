"use client";

import React, { useState } from "react";
import { changePassword } from "@/lib/auth-client";
import { FloppyDisk } from "@gravity-ui/icons";
import { Eye, EyeOff } from "lucide-react";

import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());

    if (userData.newPassword !== userData.confirmPassword) {
      toast.danger("New passwords do not match!");
      return;
    }

    if (userData.newPassword.length < 8) {
      toast.danger("Password must be at least 8 characters.");
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } = await changePassword({
        newPassword: userData.newPassword,
        currentPassword: userData.currentPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.danger(error.message || "Failed to change password.");
        return;
      }

      toast.success("Password changed successfully!");
      form.reset();

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      console.log("Password changed successfully", data);
    } catch (error) {
      console.error("Change password error:", error);
      toast.danger("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <Form className="w-full" onSubmit={handleChangePassword}>
        <Fieldset>
          <Fieldset.Legend>Change Password</Fieldset.Legend>

          <Description>
            Choose a strong password to keep your account secure.
          </Description>

          <FieldGroup>
            {/* Current Password */}
            <TextField isRequired name="currentPassword">
              <Label>Current Password</Label>

              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className="pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-default-500 hover:text-foreground"
                  aria-label={
                    showCurrentPassword ? "Hide password" : "Show password"
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <FieldError />
            </TextField>

            {/* New Password */}
            <TextField
              isRequired
              name="newPassword"
              validate={(value) =>
                value.length < 8
                  ? "Password must be at least 8 characters"
                  : null
              }
            >
              <Label>New Password</Label>

              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((previous) => !previous)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-default-500 hover:text-foreground"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <FieldError />
            </TextField>

            {/* Confirm New Password */}
            <TextField
              isRequired
              name="confirmPassword"
              validate={(value) =>
                !value ? "Please confirm your new password" : null
              }
            >
              <Label>Confirm New Password</Label>

              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-default-500 hover:text-foreground"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <FieldError />
            </TextField>
          </FieldGroup>

          <Fieldset.Actions>
            <Button type="submit" isDisabled={isLoading}>
              <FloppyDisk />
              {isLoading ? "Updating..." : "Change Password"}
            </Button>

            <Button
              type="reset"
              variant="secondary"
              isDisabled={isLoading}
            >
              Cancel
            </Button>
          </Fieldset.Actions>
        </Fieldset>
      </Form>
    </div>
  );
};

export default SettingsPage;