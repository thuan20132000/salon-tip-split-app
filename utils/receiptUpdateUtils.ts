import { StaffBillType } from "@/types/receipt.type";


export const getSubtotalDiscountPrice = (staffBills?: StaffBillType[]) => {
  if (!staffBills) {
    return 0;
  }
  let subtotalDiscountPrice = staffBills?.reduce((sum, staff) => sum + (Number(staff?.discount_price) ?? 0), 0);
  return subtotalDiscountPrice;
}


export const getSubtotalWithoutDiscountPrice = (staffBills?: StaffBillType[]) => {
  if (!staffBills) {

    return 0;
  }
  let subtotalWithoutDiscountPrice = staffBills?.reduce((sum, staff) => {
    if(staff.discount_price  && Number(staff.discount_price) > 0) {
      return sum + 0;
    }
    return sum + (Number(staff.service_amount) ?? 0);
  }, 0);

  return subtotalWithoutDiscountPrice;
}

export const getTotalServicePrice = (staffBills?: StaffBillType[]) => {
  if (!staffBills) {
    return 0;
  }
  let totalServicePrice = staffBills?.reduce((sum, staff) => sum + Number(staff.service_amount), 0);
  return totalServicePrice;
}