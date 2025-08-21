"use client";

import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const passwordSchema = z.object({
  password: z.string().min(1, { message: "Password cannot be empty!" }),
});

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemName: string;
  itemType: string;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
}: DeleteConfirmationDialogProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const auth = getAuth();

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const handlePasswordVerification = async (values: z.infer<typeof passwordSchema>) => {
    if (!auth.currentUser?.email) {
      toast.error("No authenticated user found");
      return;
    }

    setIsVerifying(true);
    try {
      // Re-authenticate the user with their password
      await signInWithEmailAndPassword(auth, auth.currentUser.email, values.password);
      
      // Password verified, proceed with deletion
      setIsDeleting(true);
      await onConfirm();
      
      toast.success(`${itemType} deleted successfully`);
      onClose();
    } catch (error: any) {
      console.error("Password verification failed:", error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        toast.error("Incorrect password. Please try again.");
      } else {
        toast.error("Failed to verify password. Please try again.");
      }
    } finally {
      setIsVerifying(false);
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Delete {itemType}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              You are about to permanently delete <strong>"{itemName}"</strong>. 
              This will remove all associated data and cannot be reversed.
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePasswordVerification)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Confirm your password to continue
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        disabled={isVerifying || isDeleting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isVerifying || isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={form.handleSubmit(handlePasswordVerification)}
            disabled={isVerifying || isDeleting}
          >
            {isVerifying ? (
              "Verifying..."
            ) : isDeleting ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete {itemType}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}