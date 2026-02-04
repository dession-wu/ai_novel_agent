import React, { useState, useEffect } from 'react';
import { worldApi, Character, Location, WorldSetting } from '../api/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface WorldBibleProps {
  novelId: number;
}

const WorldBible: React.FC<WorldBibleProps> = ({ novelId }) => {
  const [activeTab, setActiveTab] = useState<'characters' | 'locations' | 'settings'>('characters');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [settings, setSettings] = useState<WorldSetting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'characters') {
        const data = await worldApi.getCharacters(novelId);
        setCharacters(data);
      } else if (activeTab === 'locations') {
        const data = await worldApi.getLocations(novelId);
        setLocations(data);
      } else {
        const data = await worldApi.getSettings(novelId);
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch world data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (novelId) {
      fetchData();
    }
  }, [novelId, activeTab]);

  const handleSubmit = async () => {
    try {
      if (activeTab === 'characters') {
        await worldApi.createCharacter(novelId, formData);
      } else if (activeTab === 'locations') {
        await worldApi.createLocation(novelId, formData);
      } else {
        await worldApi.createSetting(novelId, formData);
      }
      setIsDialogOpen(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-l border-border w-80">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-4">设定集 (World Bible)</h2>
        <div className="flex space-x-2">
          {['characters', 'locations', 'settings'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab as any)}
              className="flex-1 capitalize"
            >
              {tab === 'characters' ? '角色' : tab === 'locations' ? '地点' : '设定'}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* List Items */}
        {isLoading ? (
          <div className="text-center text-muted-foreground">加载中...</div>
        ) : (
          <>
            {activeTab === 'characters' && characters.map(char => (
              <Card key={char.id} className="cursor-pointer hover:bg-accent/50">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base flex justify-between">
                    {char.name}
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
                      {char.role}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-sm text-muted-foreground line-clamp-2">
                  {char.description}
                </CardContent>
              </Card>
            ))}
            
            {activeTab === 'locations' && locations.map(loc => (
              <Card key={loc.id}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">{loc.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                  {loc.description}
                </CardContent>
              </Card>
            ))}

            {activeTab === 'settings' && settings.map(setting => (
              <Card key={setting.id}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base flex justify-between">
                    {setting.concept}
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
                      {setting.category}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                  {setting.description}
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">添加新{activeTab === 'characters' ? '角色' : activeTab === 'locations' ? '地点' : '设定'}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建新{activeTab === 'characters' ? '角色' : activeTab === 'locations' ? '地点' : '设定'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {activeTab === 'characters' && (
                <>
                  <div className="space-y-2">
                    <Label>姓名</Label>
                    <Input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>角色定位</Label>
                    <Input value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="主角/反派/配角" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>性别</Label>
                      <Input value={formData.gender || ''} onChange={e => setFormData({...formData, gender: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>年龄</Label>
                      <Input value={formData.age || ''} onChange={e => setFormData({...formData, age: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>描述</Label>
                    <Textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                </>
              )}

              {activeTab === 'locations' && (
                <>
                  <div className="space-y-2">
                    <Label>名称</Label>
                    <Input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>描述</Label>
                    <Textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                </>
              )}

              {activeTab === 'settings' && (
                <>
                  <div className="space-y-2">
                    <Label>概念名称</Label>
                    <Input value={formData.concept || ''} onChange={e => setFormData({...formData, concept: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>分类</Label>
                    <Input value={formData.category || 'General'} onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>描述</Label>
                    <Textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                </>
              )}
              
              <Button onClick={handleSubmit} className="w-full">保存</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default WorldBible;
