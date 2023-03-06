import {
  connect,
  OnBootCtx,
  RenderFieldExtensionCtx,
} from "datocms-plugin-sdk";
import { render } from "./utils/render";
import "datocms-react-ui/styles.css";
import PhosphorIconsPicker from "./components/PhosphorIconsPicker";

connect({
  async onBoot(ctx: OnBootCtx) {
    if (
      !ctx.currentRole.meta.final_permissions.can_edit_schema ||
      ctx.plugin.attributes.parameters.migratedFromLegacyPlugin
    ) {
      return;
    }

    // get all the fields currently associated to the plugin...
    const fields = await ctx.loadFieldsUsingPlugin();

    // ... and for each of them...
    await Promise.all(
      fields.map(async (field: any) => {
        if (field.attributes.appearance.editor === ctx.plugin.id) {
          await ctx.updateFieldAppearance(field.id, [
            {
              operation: "updateEditor",
              newFieldExtensionId: "phosphorIcons",
            },
          ]);
        }
      })
    );

    // save in configuration the fact that we already performed the migration
    ctx.updatePluginParameters({
      ...ctx.plugin.attributes.parameters,
      migratedFromLegacyPlugin: true,
    });
  },
  manualFieldExtensions() {
    return [
      {
        id: "phosphorIcons",
        name: "Phosphor Icons",
        type: "editor",
        fieldTypes: ["string"],
      },
    ];
  },
  renderFieldExtension(id: string, ctx: RenderFieldExtensionCtx) {
    render(<PhosphorIconsPicker ctx={ctx} />);
  },
});
