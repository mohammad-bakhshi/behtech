export const parser = (key, value) => {
  let parsed = {};
  switch (key) {
    case "نام":
      {
        parsed = { name: value };
      }
      break;
    case "وضعیت":
      {
        parsed = { status: value === "فعال" ? true : false };
      }
      break;
    case "آمپر":
      {
        parsed = { amp: value };
      }
      break;
    case "دسته اصلی":
      {
        parsed = { category: value };
      }
      break;
    case "زیردسته":
      {
        parsed = { subCategory: value };
      }
      break;
    case "قیمت":
      {
        parsed = { price: value };
      }
      break;
    case "شروع گارانتی":
      {
        parsed = { warrantyStartDate: value };
      }
      break;
    case "مدت گارانتی (ماه)":
      {
        parsed = { warrantyDuration: value };
      }
      break;
    case "شناسه کالا":
      {
        parsed = { productCode: value };
      }
      break;
    default:
      {
        parsed = null;
      }
      break;
  }
  return parsed;
};
