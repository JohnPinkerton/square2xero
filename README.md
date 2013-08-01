square2xero
===========

Square CSV to Xero CSV

Uses jquery-csv: https://code.google.com/p/jquery-csv/

Assumes you're using Items Detail CSV from Square.

1) Allows you to pick a CSV file from your computer.

2) Parses it, changing the headers from Square to Xero as follows:
  Date | InvoiceDate
  Time | ContactName*
  Details | Description
  Payment ID | Reference
  Device Name | InvoiceNumber*
  Category Name | AccountCode*
  Item Name | InventoryItemCode
  SKU | (Nothing currently, gets dropped during Xero import)
  Price | UnitAmount
  Discount | Discount
  Sales Tax | TaxType*
  Notes (Nothing currently, gets dropped during Xero import)

3) Changes the Date that Square provides (YYYY-MM-DD) to Xero's format (MM/DD/YYYY). 

4) Changes every record for Time to SquareUp, 

5) Alters InvoiceNumber to associate the date (IE: retailPad-2013-07-27) of the line item, multiple dates? Easily multiple invoices.

6) Changes every record for Sales Tax to Tax on Sales

7) Changes every record in Category Name to 210 for our Account Code.

8) Our Inventory Item Codes are the same in Square as Xero.

9) Allows the receipt from Square to be the description for the item.

10) Square provides the discount in terms of $ on the item, Xero based on %. This converts each line.

Some notes: This type of CSV forces every item sold as a new line, so if one sale has 6 items, it's 6 lines. Though the Reference/Description columns track that with their unique link. Should you want a detailed receipt for that item, it's in the description. That receipt has all 6 items on it, if you needed to track something down that far.

