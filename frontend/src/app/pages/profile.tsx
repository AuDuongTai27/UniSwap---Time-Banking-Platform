import { useEffect, useState, useRef } from 'react';
import { Star, Shield, Clock, Award, Pencil, X, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { apiFetch } from '@/app/data/api';
import { toast } from 'sonner';

export function Profile() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userServices, setUserServices] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editSkillsOffered, setEditSkillsOffered] = useState<string[]>([]);
  const [editSkillsNeeded, setEditSkillsNeeded] = useState<string[]>([]);
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillNeeded, setNewSkillNeeded] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = () => {
    apiFetch('/api/me').then(data => setCurrentUser(data));
    apiFetch('/api/my-services').then(data => setUserServices(Array.isArray(data) ? data : []));
    apiFetch('/api/my-reviews').then(data => setUserReviews(Array.isArray(data) ? data : []));
  };

  useEffect(() => { fetchData(); }, []);

  const parseJSON = (val: any) => Array.isArray(val) ? val : JSON.parse(val || '[]');

  const openEditModal = () => {
    if (!currentUser) return;
    setEditName(currentUser.name);
    setEditAge(String(currentUser.age || ''));
    setEditStatus(currentUser.status || '');
    setEditBio(currentUser.bio || '');
    setEditAvatar(currentUser.avatar || '');
    setEditSkillsOffered(parseJSON(currentUser.skills_offered));
    setEditSkillsNeeded(parseJSON(currentUser.skills_needed));
    setShowEditModal(true);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Ảnh tối đa 2MB'); return; }
    const reader = new FileReader();
    reader.onload = () => setEditAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    try {
      await apiFetch('/api/me', {
        method: 'PATCH',
        body: JSON.stringify({
          name: editName, age: parseInt(editAge), status: editStatus,
          bio: editBio, avatar: editAvatar,
          skills_offered: editSkillsOffered, skills_needed: editSkillsNeeded,
        }),
      });
      toast.success('Cập nhật thành công!');
      setShowEditModal(false);
      fetchData();
    } catch { toast.error('Cập nhật thất bại'); }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) { toast.error('Mật khẩu mới không khớp'); return; }
    if (newPassword.length < 6) { toast.error('Mật khẩu mới phải ít nhất 6 ký tự'); return; }
    try {
      await apiFetch('/api/me/password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success('Đổi mật khẩu thành công!');
      setShowPasswordModal(false);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) { toast.error(err.message || 'Đổi mật khẩu thất bại'); }
  };

  if (!currentUser) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const availableCredits = (currentUser.credits_earned - currentUser.credits_spent).toFixed(1);
  const skillsOffered = parseJSON(currentUser.skills_offered);
  const skillsNeeded = parseJSON(currentUser.skills_needed);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-32 w-32 border-4 border-blue-200">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="text-3xl">{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
                  {currentUser.is_verified && (
                    <Badge variant="secondary" className="gap-1"><Shield className="h-3 w-3" />Verified</Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{currentUser.status}</p>
                <p className="text-gray-700 italic mb-4">"{currentUser.bio}"</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{currentUser.rating}</span>
                    <span className="text-gray-600">({currentUser.total_reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">{currentUser.credits_earned}</span>
                    <span className="text-gray-600">credits earned</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={openEditModal} className="gap-2">
                  <Pencil className="h-4 w-4" />Edit Profile
                </Button>
                <Button variant="outline" onClick={() => setShowPasswordModal(true)} className="gap-2">
                  🔒 Đổi mật khẩu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader><CardTitle className="text-lg">Credits Balance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
                <span className="text-4xl font-bold text-blue-600">{availableCredits}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Earned:</span>
                  <span className="font-semibold text-green-600">+{currentUser.credits_earned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spent:</span>
                  <span className="font-semibold text-red-600">-{currentUser.credits_spent}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Activity Stats</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Services Posted</span>
                <span className="font-semibold">{userServices.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Reviews Received</span>
                <span className="font-semibold">{currentUser.total_reviews}</span>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-semibold">{currentUser.rating}/5.0</span>
                </div>
                <Progress value={Number(currentUser.rating) * 20} className="h-2" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Community Standing</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-2xl font-bold mb-2">⭐</div>
                <p className="text-sm text-gray-600">Active Member</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trust Score:</span>
                  <span className="font-semibold text-green-600">
                    {Number(currentUser.rating) >= 4.5 ? 'Excellent' : Number(currentUser.rating) >= 3.5 ? 'Good' : 'Fair'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Skills I Offer</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skillsOffered.map((skill: string, i: number) => (
                  <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-700">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Skills I Need</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skillsNeeded.map((skill: string, i: number) => (
                  <Badge key={i} variant="secondary" className="bg-purple-100 text-purple-700">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {userServices.length > 0 && (
          <Card className="mt-6">
            <CardHeader><CardTitle>My Posted Services</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userServices.map((service: any) => (
                  <div key={service.id} className="flex items-start gap-4 p-4 border rounded-lg hover:border-blue-300 transition-colors">
                    <img src={service.image} alt={service.title} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline">{service.category}</Badge>
                        <span className="text-gray-600">{service.duration}h</span>
                        <span className="font-semibold text-blue-600">{service.total_credits} credits</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {userReviews.length > 0 && (
          <Card className="mt-6">
            <CardHeader><CardTitle>Recent Reviews</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userReviews.map((review: any) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.reviewer_avatar} alt={review.reviewer_name} />
                        <AvatarFallback>{review.reviewer_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{review.reviewer_name}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Chỉnh sửa Profile</DialogTitle></DialogHeader>
          <div className="space-y-5 py-4">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-24 w-24 border-4 border-blue-200">
                <AvatarImage src={editAvatar} />
                <AvatarFallback className="text-2xl">{editName[0]}</AvatarFallback>
              </Avatar>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                📷 Đổi ảnh đại diện
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Họ và tên</Label>
                <Input value={editName} onChange={e => setEditName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tuổi</Label>
                <Input type="number" value={editAge} onChange={e => setEditAge(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Input placeholder="vd: 2nd-year Computer Science student" value={editStatus} onChange={e => setEditStatus(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea rows={3} value={editBio} onChange={e => setEditBio(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Skills I Offer</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editSkillsOffered.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-700 gap-1 pr-1">
                    {skill}
                    <button onClick={() => setEditSkillsOffered(prev => prev.filter((_, idx) => idx !== i))}>
                      <X className="h-3 w-3 hover:text-red-500" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Thêm kỹ năng..." value={newSkillOffered} onChange={e => setNewSkillOffered(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && newSkillOffered.trim()) { setEditSkillsOffered(prev => [...prev, newSkillOffered.trim()]); setNewSkillOffered(''); }}} />
                <Button type="button" variant="outline" onClick={() => { if (newSkillOffered.trim()) { setEditSkillsOffered(prev => [...prev, newSkillOffered.trim()]); setNewSkillOffered(''); }}}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Skills I Need</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editSkillsNeeded.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="bg-purple-100 text-purple-700 gap-1 pr-1">
                    {skill}
                    <button onClick={() => setEditSkillsNeeded(prev => prev.filter((_, idx) => idx !== i))}>
                      <X className="h-3 w-3 hover:text-red-500" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Thêm kỹ năng cần học..." value={newSkillNeeded} onChange={e => setNewSkillNeeded(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && newSkillNeeded.trim()) { setEditSkillsNeeded(prev => [...prev, newSkillNeeded.trim()]); setNewSkillNeeded(''); }}} />
                <Button type="button" variant="outline" onClick={() => { if (newSkillNeeded.trim()) { setEditSkillsNeeded(prev => [...prev, newSkillNeeded.trim()]); setNewSkillNeeded(''); }}}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Hủy</Button>
            <Button onClick={handleSaveProfile}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ĐỔI MẬT KHẨU MODAL */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Đổi mật khẩu</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Mật khẩu hiện tại</Label>
              <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Mật khẩu mới</Label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Xác nhận mật khẩu mới</Label>
              <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>Hủy</Button>
            <Button onClick={handleChangePassword}>Đổi mật khẩu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}