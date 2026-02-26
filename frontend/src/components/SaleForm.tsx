import { useState } from 'react';
import { useGetAllProducts, useRecordSale } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { CustomerType, type SaleItem } from '../backend';
import { toast } from 'sonner';

interface SaleFormProps {
  onSuccess: () => void;
}

interface LineItem {
  sku: string;
  quantity: string;
}

export default function SaleForm({ onSuccess }: SaleFormProps) {
  const { data: products = [] } = useGetAllProducts();
  const recordSale = useRecordSale();

  const [customerType, setCustomerType] = useState<'wholesale' | 'retail'>('retail');
  const [lineItems, setLineItems] = useState<LineItem[]>([{ sku: '', quantity: '1' }]);

  const addLineItem = () => {
    setLineItems([...lineItems, { sku: '', quantity: '1' }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const calculateTotal = () => {
    return lineItems.reduce((total, item) => {
      if (!item.sku || !item.quantity) return total;
      const product = products.find((p) => p.sku === item.sku);
      if (!product) return total;
      const priceInPees =
        customerType === 'wholesale'
          ? Number(product.wholesalePricePees)
          : Number(product.retailPricePees);
      return total + (priceInPees / 100) * parseInt(item.quantity);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validItems = lineItems.filter((item) => item.sku && item.quantity);
    if (validItems.length === 0) {
      toast.error('Please add at least one product');
      return;
    }

    const saleItems: SaleItem[] = validItems.map((item) => {
      const product = products.find((p) => p.sku === item.sku)!;
      const priceInPees =
        customerType === 'wholesale'
          ? product.wholesalePricePees
          : product.retailPricePees;
      return {
        sku: item.sku,
        quantity: BigInt(item.quantity),
        priceInPees: priceInPees,
      };
    });

    try {
      await recordSale.mutateAsync({
        customerType: customerType === 'wholesale' ? CustomerType.wholesale : CustomerType.retail,
        items: saleItems,
      });
      toast.success('Sale recorded successfully');
      setLineItems([{ sku: '', quantity: '1' }]);
      onSuccess();
    } catch (error) {
      toast.error('Failed to record sale');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label>Customer Type</Label>
        <RadioGroup
          value={customerType}
          onValueChange={(value: 'wholesale' | 'retail') => setCustomerType(value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="wholesale" id="wholesale" />
            <Label htmlFor="wholesale" className="font-normal cursor-pointer">
              Wholesale
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="retail" id="retail" />
            <Label htmlFor="retail" className="font-normal cursor-pointer">
              Retail
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Products</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLineItem}
            disabled={recordSale.isPending}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {lineItems.map((item, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <Select
                value={item.sku}
                onValueChange={(value) => updateLineItem(index, 'sku', value)}
                disabled={recordSale.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.sku} value={product.sku}>
                      {product.name} - GH₵
                      {(
                        Number(
                          customerType === 'wholesale'
                            ? product.wholesalePricePees
                            : product.retailPricePees
                        ) / 100
                      ).toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-24">
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                placeholder="Qty"
                disabled={recordSale.isPending}
              />
            </div>
            {lineItems.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLineItem(index)}
                disabled={recordSale.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total:</span>
          <span>GH₵{calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={recordSale.isPending}>
        {recordSale.isPending ? 'Recording...' : 'Record Sale'}
      </Button>
    </form>
  );
}
