import { FlashcardSet } from '@/lib/flashcard-types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { Trash2, Play, Calendar, BookOpen } from 'lucide-react';

interface FlashcardSetSelectorProps {
  sets: FlashcardSet[];
  onSelectSet: (set: FlashcardSet) => void;
  onDeleteSet: (setId: string) => void;
}

export const FlashcardSetSelector = ({
  sets,
  onSelectSet,
  onDeleteSet,
}: FlashcardSetSelectorProps) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (sets.length === 0) {
    return (
      <Card className="flex items-center justify-center h-[300px] bg-secondary/30">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No Flashcard Sets</p>
            <p className="text-xs text-muted-foreground mt-1">
              Generate your first flashcard set to get started
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Your Flashcard Sets</h3>

      <div className="grid gap-3">
        {sets.map((set) => (
          <Card
            key={set.id}
            className="p-4 hover:bg-secondary/50 transition-colors border-border"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground truncate">
                    {set.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {set.documentSource}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-sm font-semibold text-foreground">
                    {set.stats.total}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-green-700">Mastered</p>
                  <p className="text-sm font-semibold text-green-700">
                    {set.stats.mastered}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-blue-700">Learning</p>
                  <p className="text-sm font-semibold text-blue-700">
                    {set.stats.learning}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-700">New</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {set.stats.new}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(set.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => onSelectSet(set)}
                  className="flex-1 gap-2"
                >
                  <Play className="w-4 h-4" />
                  Study
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteConfirmId(set.id)}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => {
        if (!open) setDeleteConfirmId(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flashcard Set?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The flashcard set and all its cards will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmId) {
                  onDeleteSet(deleteConfirmId);
                  setDeleteConfirmId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
