import { useEffect, useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, Lock, CreditCard, Bell, Moon, Save, Sparkles, Phone } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';

export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    career_level:'',
    avatar_url:''
  });

   async function loadUser() {
    try {
      const res = await api.get("/user/me");
      const user = res.data;

      setProfileData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || '',
        location: user.location || '',
        career_level: user.career_level || "",
        avatar_url: user.avatar_url || "",
      });

      setDarkMode(user.settings?.darkMode || false);
      setEmailNotifications(user.settings?.emailNotifications ?? true);
      setMarketingEmails(user.settings?.marketingEmails ?? false);

      localStorage.setItem('user', JSON.stringify(user));

      // Dispatch a global event so other components know
      window.dispatchEvent(new Event("user-updated"));

    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    loadUser();
  }, []);

  function getInitials(fullName?: string): string {
    if (!fullName) return "NA";
    
    const words = fullName.trim().split(" ").filter(Boolean);
    
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return "NA";
  }

  const handleSaveProfile = async () => {
    try {
      const payload = {
        full_name: profileData.full_name,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        career_level: profileData.career_level,
      };
      await api.put("/user/profile", payload);
      toast.success("Profile updated successfully!");
      loadUser();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Error updating profile.");
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.old_password || !passwords.new_password || !passwords.confirm_password) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await api.put("/user/password", {
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      });
      toast.success("Password updated successfully!");
      setPasswords({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to change password.");
    }
  };

  const handleSaveSettings = async () => {
    try {
      await api.put("/user/settings", {
        darkMode,
        emailNotifications,
        marketingEmails,
      });
      toast.success("Notification preferences updated!");
    } catch (err: any) {
      toast.error("Failed to save notification preferences.");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/user/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile photo updated!");
      setProfileData({ ...profileData, avatar_url: res.data.avatar_url });
      loadUser();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to upload photo");
    }
  };


  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-1 lg:grid-cols-3 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            {/* <TabsTrigger value="subscription">Subscription</TabsTrigger> */}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-violet-600" />
                  <CardTitle>Profile Information</CardTitle>
                </div>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                     {profileData.avatar_url ? (
                        <img src={`${profileData.avatar_url}`} alt="Avatar" className="w-full h-full object-cover rounded-full" style={{ objectFit: 'cover' }} />
                      ) : (
                        <AvatarFallback className="bg-violet-600 text-white text-xl">
                          {getInitials(profileData.full_name)}
                        </AvatarFallback>
                      )}
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" onClick={() => document.getElementById('avatarUpload')?.click()}>
                      Change Photo
                    </Button>
                    <input
                      id="avatarUpload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />

                    <p className="text-gray-500 mt-2">
                      JPG, PNG or GIF. Max size 2MB
                    </p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="career_level">Career Level</Label>
                    <Select 
                      value={profileData.career_level} 
                      onValueChange={(value) => setFormData({ ...profileData, career_level: value })}
                      required
                    >
                      <SelectTrigger id="careerLevel">
                        <SelectValue placeholder="Select your career level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fresher">Fresher</SelectItem>
                        <SelectItem value="mid">Mid-Level (2-5 years)</SelectItem>
                        <SelectItem value="senior">Senior (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="bg-violet-600 hover:bg-violet-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-violet-600" />
                  <CardTitle>Password</CardTitle>
                </div>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" required type="password" placeholder="••••••••" value={passwords.old_password} onChange={(e) =>
                      setPasswords({ ...passwords, old_password: e.target.value })
                    }/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" required type="password" placeholder="••••••••" value={passwords.new_password}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new_password: e.target.value })
                    }/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" required type="password" placeholder="••••••••" value={passwords.confirm_password}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm_password: e.target.value })
                    }/>
                </div>
                <Button onClick={handleChangePassword} className="bg-violet-600 hover:bg-violet-700">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 mb-1">Status: Not Enabled</p>
                    <p className="text-gray-600">
                      Protect your account with 2FA
                    </p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card> */}
          </TabsContent>

          {/* Subscription Tab */}
          {/* <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-violet-600" />
                  <CardTitle>Current Plan</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-gray-900">Free Plan</h3>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <p className="text-gray-600 mb-4">
                      You're currently on the Free plan with limited features
                    </p>
                    <Link to="/pricing">
                      <Button className="bg-violet-600 hover:bg-violet-700">
                        Upgrade Plan
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-gray-900 mb-4">Plan Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan Type</span>
                      <span className="text-gray-900">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Billing Cycle</span>
                      <span className="text-gray-900">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Billing Date</span>
                      <span className="text-gray-900">-</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                  <CardTitle>AI Credits</CardTitle>
                </div>
                <CardDescription>Your remaining AI generation credits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-violet-50 rounded-lg">
                    <div>
                      <p className="text-gray-900">Resume Generations</p>
                      <p className="text-violet-600">2 of 3 remaining this month</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-violet-50 rounded-lg">
                    <div>
                      <p className="text-gray-900">Cover Letters</p>
                      <p className="text-violet-600">1 of 1 remaining this month</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-violet-50 rounded-lg">
                    <div>
                      <p className="text-gray-900">Job Fit Analysis</p>
                      <p className="text-violet-600">3 of 5 remaining this month</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Credits reset on the 1st of each month. Upgrade for unlimited access.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}

          {/* Notifications Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-violet-600" />
                  <CardTitle>Email Notifications</CardTitle>
                </div>
                <CardDescription>Manage your email notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900">Email Notifications</p>
                      <p className="text-gray-600">
                        Receive email updates about your account activity
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900">Marketing Emails</p>
                      <p className="text-gray-600">
                        Receive tips, promotions, and product updates
                      </p>
                    </div>
                    <Switch
                      checked={marketingEmails}
                      onCheckedChange={setMarketingEmails}
                    />
                  </div>
                </div>
              </CardContent>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-gray-900">Dark Mode</p>
                      <p className="text-gray-600">Enable dark theme across the app</p>
                    </div>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                 <Button onClick={handleSaveSettings} className="bg-violet-600 hover:bg-violet-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
            {/* Preferences */}
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        {/* <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 mb-1">Delete Account</p>
                <p className="text-gray-600">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="outline" className="text-red-600 hover:text-red-700 border-red-600">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </DashboardLayout>
  );
}
