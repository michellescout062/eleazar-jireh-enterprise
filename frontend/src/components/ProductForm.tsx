import { useState, useEffect } from 'react';
import { useAddProduct, useEditProduct } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Product } from '../backend';
import { toast } from 'sonner';

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    wholesalePrice: '',
    retailPrice: '',
    quantityInStock: '',
    description: '',
  });

  const addProduct = useAddProduct();
  const editProduct = useEditProduct();

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        category: product.category,
        wholesalePrice: (Number(product.wholesalePricePees) / 100).toFixed(2),
        retailPrice: (Number(product.retailPricePees) / 100).toFixed(2),
        quantityInStock: product.quantityInStock.toString(),
        description: product.description,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData: Product = {
      sku: formData.sku,
      name: formData.name,
      category: formData.category,
      wholesalePricePees: BigInt(Math.round(parseFloat(formData.wholesalePrice) * 100)),
      retailPricePees: BigInt(Math.round(parseFloat(formData.retailPrice) * 100)),
      quantityInStock: BigInt(formData.quantityInStock),
      description: formData.description,
    };

    try {
      if (product) {
        await editProduct.mutateAsync({ sku: product.sku, product: productData });
        toast.success('Product updated successfully');
      } else {
        await addProduct.mutateAsync(productData);
        toast.success('Product added successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(product ? 'Failed to update product' : 'Failed to add product');
    }
  };

  const isLoading = addProduct.isPending || editProduct.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="e.g., PROD-001"
            required
            disabled={!!product || isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Rice 25kg"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="e.g., Grains"
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="wholesalePrice">Wholesale Price (GH₵) *</Label>
          <Input
            id="wholesalePrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.wholesalePrice}
            onChange={(e) =>
              setFormData({ ...formData, wholesalePrice: e.target.value })
            }
            placeholder="0.00"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="retailPrice">Retail Price (GH₵) *</Label>
          <Input
            id="retailPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.retailPrice}
            onChange={(e) =>
              setFormData({ ...formData, retailPrice: e.target.value })
            }
            placeholder="0.00"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantityInStock">Quantity in Stock *</Label>
          <Input
            id="quantityInStock"
            type="number"
            min="0"
            value={formData.quantityInStock}
            onChange={(e) =>
              setFormData({ ...formData, quantityInStock: e.target.value })
            }
            placeholder="0"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Product description..."
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}
