import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  VerifiedIcon, 
  ShieldCheck, 
  Mail, 
  User, 
  Calendar, 
  MapPin, 
  Building2, 
  Globe,
  CheckCircle2,
  Edit
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription, // Added import
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import AccountVerificationForm from "./AccountVerificationForm";
import UpdateUserInfo from "./UpdateUserInfo";

const Profile = () => {
  // FIX: Optimized selector to prevent root state re-render warning
  const { user } = useSelector(state => state.auth);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const handleSubmitEnableTwoStepVerification = () => {
    console.log("two step Verification");
  };

  const profileData = [
    { icon: Mail, label: "Email", value: user?.email || "N/A" },
    { icon: User, label: "Full Name", value: user?.fullName || "N/A" },
    { icon: Calendar, label: "Date Of Birth", value: user?.dateOfBirth || "N/A" },
    { icon: Globe, label: "Nationality", value: user?.nationality || "N/A" },
  ];

  const addressData = [
    { icon: MapPin, label: "Address", value: user?.address?.street || "N/A" },
    { icon: Building2, label: "City", value: user?.address?.city || "N/A" },
    { icon: MapPin, label: "Post Code", value: user?.address?.postCode || "N/A" },
    { icon: Globe, label: "Country", value: user?.address?.country || "N/A" },
  ];

  return (
    <div className="flex flex-col items-center py-12 px-4 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Account Information Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Your Information
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  View and manage your personal details
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge 
                  variant="secondary" 
                  className="gap-1.5 px-3 py-1 font-medium shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </Badge>
                
                {/* Edit Info Dialog */}
                <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Info
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Update Personal Information</DialogTitle>
                      {/* FIX: Accessibility description */}
                      <DialogDescription className="sr-only">
                        Modify your profile details including address and contact information.
                      </DialogDescription>
                    </DialogHeader>
                    <UpdateUserInfo onClose={() => setOpenEditDialog(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
              
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                  Personal Details
                </h3>
                <div className="space-y-5">
                  {profileData.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-start gap-4 group">
                        <div className="mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                          <Icon className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {item.label}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                  Location Details
                </h3>
                <div className="space-y-5">
                  {addressData.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-start gap-4 group">
                        <div className="mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                          <Icon className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {item.label}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <ShieldCheck className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="flex-1 space-y-1.5">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Security Settings
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage authentication and account security
                </p>
              </div>
            </div>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="pt-8 space-y-6">
            
            {/* 2FA Status Section */}
            <div className="space-y-4 p-6 rounded-lg border bg-card">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold">
                      Two-Factor Authentication
                    </h3>
                    {user?.twoFactorAuth?.enabled ? (
                      <Badge variant="secondary" className="gap-1.5 font-medium">
                        <VerifiedIcon className="w-3.5 h-3.5" />
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1.5 font-medium">
                        Disabled
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Two-step verification adds an extra layer of security to your account. 
                    You'll need both your password and a verification code to sign in.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="lg"
                    className="gap-2 font-medium"
                  >
                    <ShieldCheck className="w-4 h-4" strokeWidth={2} />
                    Manage Two-Step Verification
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary">
                        <ShieldCheck className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <DialogTitle className="text-xl font-semibold">
                        Verify Your Account
                      </DialogTitle>
                    </div>
                    {/* FIX: Accessibility description */}
                    <DialogDescription>
                      Complete verification to manage two-step authentication settings.
                    </DialogDescription>
                  </DialogHeader>
                  <Separator className="my-4" />
                  <AccountVerificationForm
                    handleSubmit={handleSubmitEnableTwoStepVerification}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;