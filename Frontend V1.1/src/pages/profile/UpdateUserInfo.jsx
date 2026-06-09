import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Globe, MapPin, Building2 } from 'lucide-react';
import { updateUser } from '@/State/Auth/action';

const UpdateUserInfo = ({ onClose }) => {
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: auth.user?.fullName || '',
    email: auth.user?.email || '',
    dateOfBirth: auth.user?.dateOfBirth || '',
    nationality: auth.user?.nationality || '',
    street: auth.user?.address?.street || '',
    city: auth.user?.address?.city || '',
    postCode: auth.user?.address?.postCode || '',
    country: auth.user?.address?.country || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedUserData = {
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      nationality: formData.nationality,
      address: {
        street: formData.street,
        city: formData.city,
        postCode: formData.postCode,
        country: formData.country,
      }
    };

    try {
      await dispatch(updateUser(updatedUserData));
      alert('Profile updated successfully!');
      if (onClose) onClose();
    } catch (error) {
      alert('Failed to update profile: ' + error.message);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Update Your Information</CardTitle>
        <p className="text-sm text-muted-foreground">
          Edit your personal details and address
        </p>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Personal Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Nationality
                </Label>
                <Input
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  placeholder="Enter your nationality"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Address Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Street Address
                </Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Enter your street address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postCode" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Post Code
                </Label>
                <Input
                  id="postCode"
                  name="postCode"
                  value={formData.postCode}
                  onChange={handleChange}
                  placeholder="Enter post code"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="country" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter your country"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateUserInfo;
