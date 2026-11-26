import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../services/apiClient';
import { useToast } from './ToastContext';

const HqContext = createContext(null);

function formatToday() {
  const d = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
}

export function HqProvider({ children }) {
  const toast = useToast();
  const [activeScreen, setActiveScreen] = useState('DASHBOARD');
  const [franchisees, setFranchisees] = useState([]);
  const [stores, setStores] = useState([]);
  const [audits, setAudits] = useState([]);
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showFranchiseModal, setShowFranchiseModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [selectedFranchiseName, setSelectedFranchiseName] = useState(null);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [franRes, storeRes, audRes, prodRes, reqRes] = await Promise.all([
        apiRequest('/franchisees'),
        apiRequest('/stores?limit=1000'),
        apiRequest('/audits?limit=500'),
        apiRequest('/products'),
        apiRequest('/requests')
      ]);

      setFranchisees(Array.isArray(franRes?.data) ? franRes.data : []);
      setStores(Array.isArray(storeRes?.data) ? storeRes.data : []);
      setAudits(Array.isArray(audRes?.data) ? audRes.data : []);
      setProducts(Array.isArray(prodRes?.data) ? prodRes.data : []);
      setRequests(Array.isArray(reqRes?.data) ? reqRes.data : []);
    } catch (err) {
      toast.error(err.message || 'Unable to connect to HFA KFC Backend.', 'Sync Failed');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const submitProductRequest = async ({
    productName,
    productCategory,
    supplier,
    productCode,
    code,
    manufacturer,
    siteEcCode,
    notes,
    files = []
  }) => {
    setIsSubmitting(true);
    try {
      const payload = {
        requestType: 'New Product Request',
        productName: productName.trim(),
        productCategory,
        supplier: supplier.trim(),
        productCode: (productCode || code || '').trim(),
        branchCode: (productCode || code || 'HQ-PROD').trim(),
        storeName: `${productName.trim()} (${productCategory})`,
        franchisee: supplier.trim() || 'KFC Headquarters',
        notes: [
          manufacturer ? `Manufacturer: ${manufacturer.trim()}` : '',
          siteEcCode ? `Site EC Code: ${siteEcCode.trim()}` : '',
          files.length ? `Files: ${files.join(', ')}` : '',
          notes.trim()
        ]
          .filter(Boolean)
          .join(' | '),
        source: 'KFC Headquarters',
        status: 'Submitted',
        date: formatToday()
      };
      const res = await apiRequest('/requests', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const created = res?.data || { ...payload, _id: `req-${Date.now()}` };
      setRequests((prev) => [created, ...prev]);
      setShowProductModal(false);
      toast.success(
        `Product request for "${productName}" (${productCategory}) submitted.`,
        'New Product Submitted'
      );
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to submit product request.', 'Submission Error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitFranchiseRequest = async ({
    franchiseeName,
    contactPerson,
    contactEmail = '',
    contactPhone,
    address,
    postcode,
    notes = ''
  }) => {
    setIsSubmitting(true);
    try {
      const payload = {
        requestType: 'New Franchisee Request',
        franchisee: franchiseeName.trim(),
        storeName: `${franchiseeName.trim()} HQ`,
        branchCode: 'HQ-FRAN',
        contactPerson: contactPerson.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        address: address.trim(),
        postcode: postcode.trim(),
        notes: notes.trim(),
        source: 'KFC Headquarters',
        status: 'Submitted',
        date: formatToday()
      };
      const res = await apiRequest('/requests', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const created = res?.data || { ...payload, _id: `req-${Date.now()}` };
      setRequests((prev) => [created, ...prev]);
      setShowFranchiseModal(false);
      toast.success(
        `New Franchisee request for "${franchiseeName}" submitted.`,
        'New Franchisee Submitted'
      );
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to submit franchisee request.', 'Submission Error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitStoreRequest = async ({
    franchisee,
    branchCode,
    storeName,
    address,
    postcode,
    contactPerson = '',
    contactPhone = '',
    openingDate = '',
    storeType = 'New Store',
    notes = ''
  }) => {
    setIsSubmitting(true);
    try {
      const payload = {
        requestType: storeType || 'New Store',
        franchisee: franchisee.trim(),
        branchCode: branchCode.trim() || 'HQ-STORE',
        storeName: storeName.trim(),
        address: address.trim(),
        postcode: postcode.trim(),
        contactPerson: contactPerson.trim(),
        contactPhone: contactPhone.trim(),
        openingDate: openingDate.trim(),
        notes: notes.trim(),
        source: 'KFC Headquarters',
        status: 'Submitted',
        date: formatToday()
      };
      const res = await apiRequest('/requests', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const created = res?.data || { ...payload, _id: `req-${Date.now()}` };
      setRequests((prev) => [created, ...prev]);
      setShowStoreModal(false);
      toast.success(
        `${storeType} request for "${storeName}" under "${franchisee}" submitted.`,
        'New Store Submitted'
      );
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to submit store request.', 'Submission Error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HqContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        franchisees,
        stores,
        audits,
        products,
        requests,
        isLoading,
        isSubmitting,
        refreshAll,
        showProductModal,
        setShowProductModal,
        showFranchiseModal,
        setShowFranchiseModal,
        showStoreModal,
        setShowStoreModal,
        selectedFranchiseName,
        setSelectedFranchiseName,
        submitProductRequest,
        submitFranchiseRequest,
        submitStoreRequest
      }}
    >
      {children}
    </HqContext.Provider>
  );
}

export function useHq() {
  const ctx = useContext(HqContext);
  if (!ctx) throw new Error('useHq must be used within HqProvider');
  return ctx;
}
