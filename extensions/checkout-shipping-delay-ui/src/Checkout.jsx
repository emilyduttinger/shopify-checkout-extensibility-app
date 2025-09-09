import { useEffect, useState } from "react";
import {
  useCartLineTarget,
  Text,
  useAppMetafields,
  reactExtension
} from "@shopify/ui-extensions-react/checkout";

// Extension entry point
export default reactExtension("purchase.checkout.cart-line-item.render-after", () => <App />)

function App() {
  // Use the merchant-defined metafield for watering instructions and map it to a cart line
  const shippingDelayMetafields = useAppMetafields({
    type: "product",
    namespace: "custom",
    key: "shipping_delay_message"
  });
  const cartLineTarget = useCartLineTarget();

  const [shippingDelayText, setShippingDelayText] = useState("");

  useEffect(() => {
    const productId = cartLineTarget?.merchandise?.product?.id;
    if (!productId) {
      return;
    }

    const shippingDelayMetafield = shippingDelayMetafields.find(({target}) => {
      // Check if the target of the metafield is the product from our cart line
      return `gid://shopify/Product/${target.id}` === productId;
    });

    // If we find the metafield, set the watering instructions for this cart line
    if (typeof shippingDelayMetafield?.metafield?.value === "string") {
      setShippingDelayText(shippingDelayMetafield.metafield.value);
    }
  }, [cartLineTarget, shippingDelayMetafields]);

  // Render the watering instructions if applicable
  if (shippingDelayText) {
    return (
        <Text>
          {shippingDelayText}
        </Text>
      );
  }

  return null;
}