"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export interface MasterDataField {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "color";
  placeholder?: string;
  required?: boolean;
}

interface MasterDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  title: string;
  fields: MasterDataField[];
  initialData?: any;
}

export default function MasterDataDialog({
  isOpen,
  onClose,
  onSave,
  title,
  fields,
  initialData,
}: MasterDataDialogProps) {
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        const defaultData: any = {};
        fields.forEach(f => {
          if (f.type === "number") defaultData[f.name] = 0;
          else defaultData[f.name] = "";
        });
        setFormData(defaultData);
      }
    }
  }, [initialData, isOpen, fields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error: any) {
      // Error handling is usually done in the onSave caller, but we can catch it here too
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] border-none shadow-2xl rounded-2xl overflow-hidden p-0">
        <div className="bg-white px-8 py-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-black tracking-tight text-text-primary">{title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-[0.65rem] font-black uppercase tracking-[0.15em] text-text-muted ml-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="bg-secondary-50/50 border-border font-bold text-sm min-h-[100px] focus:bg-white transition-all rounded-xl"
                  />
                ) : (
                  <div className="relative">
                    <Input
                      id={field.name}
                      type="text"
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      disabled={field.name === "id" && !!initialData}
                      className="bg-secondary-50/50 border-border font-bold text-sm h-12 focus:bg-white transition-all rounded-xl pl-4"
                    />
                    {field.type === "color" && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                        <input
                          type="color"
                          value={formData[field.name] || "#000000"}
                          onChange={(e) => handleChange(field.name, e.target.value.toUpperCase())}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div
                          className="w-7 h-7 rounded-lg border border-border shadow-inner"
                          style={{ backgroundColor: formData[field.name] || "#000000" }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center gap-3 mt-8">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1 font-black uppercase tracking-widest text-[0.65rem] h-12 rounded-xl"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] bg-primary-500 hover:bg-primary-600 text-white font-black uppercase tracking-widest text-[0.65rem] h-12 rounded-xl shadow-lg shadow-primary-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
