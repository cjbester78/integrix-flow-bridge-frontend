import { FieldNode, WebserviceStructures } from './types';

// Demo webservice files
export const demoWebservices = [
  'CustomerOrderService.wsdl',
  'InventoryManagementService.wsdl', 
  'PaymentProcessingService.wsdl',
  'UtilitiesDeviceERPSmartMeterRegisterBulkCreateConfirmation_Out.wsdl',
  'UtilitiesDeviceERPSmartMeterRegisterBulkCreateConfirmation_In.wsdl'
];

// Mock structures for demo webservices
export const webserviceStructures: WebserviceStructures = {
  'CustomerOrderService.wsdl': [
    {
      id: 'customer_1',
      name: 'CustomerOrder',
      type: 'object',
      path: '/CustomerOrder',
      expanded: true,
      children: [
        {
          id: 'customer_2',
          name: 'OrderHeader',
          type: 'object',
          path: '/OrderHeader',
          expanded: true,
          children: [
            { id: 'customer_3', name: 'OrderID', type: 'string', path: '/OrderHeader/OrderID' },
            { id: 'customer_4', name: 'CustomerID', type: 'string', path: '/OrderHeader/CustomerID' },
            { id: 'customer_5', name: 'OrderDate', type: 'date', path: '/OrderHeader/OrderDate' }
          ]
        },
        {
          id: 'customer_6',
          name: 'OrderItems',
          type: 'array',
          path: '/OrderItems',
          expanded: false,
          children: [
            { id: 'customer_7', name: 'ProductID', type: 'string', path: '/OrderItems/ProductID' },
            { id: 'customer_8', name: 'Quantity', type: 'number', path: '/OrderItems/Quantity' },
            { id: 'customer_9', name: 'Price', type: 'decimal', path: '/OrderItems/Price' }
          ]
        }
      ]
    }
  ],
  'InventoryManagementService.wsdl': [
    {
      id: 'inventory_1',
      name: 'InventoryUpdate',
      type: 'object',
      path: '/InventoryUpdate',
      expanded: true,
      children: [
        { id: 'inventory_2', name: 'ProductID', type: 'string', path: '/InventoryUpdate/ProductID' },
        { id: 'inventory_3', name: 'StockLevel', type: 'number', path: '/InventoryUpdate/StockLevel' },
        { id: 'inventory_4', name: 'Location', type: 'string', path: '/InventoryUpdate/Location' }
      ]
    }
  ]
};