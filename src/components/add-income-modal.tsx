import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import useIncomeStore, { mockIncomeUserId } from "@/stores/income-store";
import useDisclosure from "@/hooks/use-disclosure";

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose }) => {
  const { addIncome, addCategory, categories } = useIncomeStore();
  const { isOpen: isPopoverOpen, onClose: onPopoverClose, onOpen: onPopoverOpen } = useDisclosure();

  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");

  const reset = () => {
    setDescription("");
    setAmount("");
    setCategoryId("");
    setDate(new Date());
  };

  const handleSubmit = () => {
    const currentDate = date || new Date();

    if (!amount || !description || (!categoryId && !customCategoryName)) {
      toast.warning("Please fill in all fields");
      return;
    }

    let finalCategoryId = categoryId;
    if (isCustomCategory && customCategoryName) {
      addCategory({ user_id: mockIncomeUserId, name: customCategoryName });
      const created = [...categories, { id: "", user_id: "", name: "", created_at: "" }].find(
        (c) => c.name === customCategoryName,
      );
      finalCategoryId = created?.id || "";
    }

    const newIncome = {
      user_id: mockIncomeUserId,
      amount: Number(amount),
      description,
      category_id: finalCategoryId || undefined,
      date: currentDate.toISOString(),
      is_recurring: false,
    };

    addIncome(newIncome);
    toast.success("Income added successfully");
    onClose();
    reset();
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Add New Income</h2>
        <div className="space-y-4">
          <Input
            placeholder="Source/Description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : "")}
          />
          {/* Category Selection */}
          <Select
            value={isCustomCategory ? "__custom__" : categoryId || ""}
            onValueChange={(value) => {
              if (value === "__custom__") {
                setIsCustomCategory(true);
                setCategoryId("");
              } else {
                setIsCustomCategory(false);
                setCategoryId(value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
              <SelectItem value="__custom__">Other… (Add custom)</SelectItem>
            </SelectContent>
          </Select>
          {isCustomCategory && (
            <Input
              placeholder="Enter custom category"
              type="text"
              value={customCategoryName}
              onChange={(e) => setCustomCategoryName(e.target.value)}
            />
          )}
          <div>
            <Popover open={isPopoverOpen} onOpenChange={onPopoverOpen}>
              <PopoverTrigger asChild>
                <Button className="w-full justify-start" variant="outline">
                  {date ? format(date, "yyyy-MM-dd") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  className="border rounded"
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date);
                    onPopoverClose();
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button className="mr-2" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddIncomeModal;


