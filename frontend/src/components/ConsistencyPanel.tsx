import React, { useState } from 'react';
import { novelApi } from '../api/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { AlertTriangle, CheckCircle, Clock, MapPin, User, AlertCircle } from 'lucide-react';

interface ConsistencyIssue {
  type: string;
  message: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
  quote: string;
}

interface ConsistencyPanelProps {
  novelId: number;
  chapterId: number;
}

const ConsistencyPanel: React.FC<ConsistencyPanelProps> = ({ novelId, chapterId }) => {
  const [issues, setIssues] = useState<ConsistencyIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const handleCheck = async () => {
    setIsLoading(true);
    try {
      const result = await novelApi.checkConsistency(novelId, chapterId);
      setIssues(result.issues || []);
      setHasChecked(true);
    } catch (error) {
      console.error('Consistency check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'time_conflict': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'location_conflict': return <MapPin className="w-4 h-4 text-blue-500" />;
      case 'character_conflict': return <User className="w-4 h-4 text-red-500" />;
      case 'setting_conflict': return <AlertTriangle className="w-4 h-4 text-purple-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-l border-border w-80">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          逻辑卫士 (Logic Guardian)
        </h2>
        <Button 
          onClick={handleCheck} 
          disabled={isLoading} 
          className="w-full"
          variant={hasChecked ? "outline" : "default"}
        >
          {isLoading ? "正在扫描全书..." : "开始逻辑检查"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-4 text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p>正在深度分析剧情逻辑...</p>
            <p className="text-xs">正在比对世界观设定...</p>
          </div>
        ) : hasChecked && issues.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p>未发现明显逻辑漏洞</p>
            <p className="text-sm">您的剧情逻辑严密！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader className="p-3 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      {getIcon(issue.type)}
                      <span className="capitalize">{issue.type.replace('_', ' ')}</span>
                    </CardTitle>
                    <Badge variant="secondary" className={getSeverityColor(issue.severity)}>
                      {issue.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0 text-sm">
                  <p className="mb-2 font-medium">{issue.message}</p>
                  {issue.quote && (
                    <div className="bg-muted p-2 rounded text-xs italic mb-2 border-l-2 border-primary/50">
                      "{issue.quote}"
                    </div>
                  )}
                  {issue.suggestion && (
                    <div className="text-muted-foreground text-xs">
                      <span className="font-semibold">建议: </span>{issue.suggestion}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsistencyPanel;
