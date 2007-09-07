<?php
/**
 * This file implements the UI controller for the dashboard.
 *
 * b2evolution - {@link http://b2evolution.net/}
 * Released under GNU GPL License - {@link http://b2evolution.net/about/license.html}
 *
 * @copyright (c)2003-2007 by Francois PLANQUE - {@link http://fplanque.net/}
 *
 * {@internal Open Source relicensing agreement:
 * }}
 *
 * @package admin
 *
 * {@internal Below is a list of authors who have contributed to design/coding of this file: }}
 * @author fplanque: Francois PLANQUE.
 *
 * @todo add 5 plugin hooks
 *
 * @version $Id$
 */
if( !defined('EVO_MAIN_INIT') ) die( 'Please, do not access this page directly.' );

/**
 * @var User
 */
global $current_User;

if( $blog )
{
	if( ! $current_User->check_perm( 'blog_ismember', '', false, $blog ) )
	{	// We don't have permission for the requested blog (may happen if we come to admin from a link on a different blog)
		set_working_blog( 0 );
		unset( $Blog );
	}
}

$blogListButtons = $AdminUI->get_html_collection_list( 'blog_ismember', 'view',
											regenerate_url( array('blog'), 'blog=%d' ),
											T_('Global'), regenerate_url( array('blog'), 'blog=0' ) );

$AdminUI->set_path( 'dashboard' );

// Display <html><head>...</head> section! (Note: should be done early if actions do not redirect)
$AdminUI->disp_html_head();

// Display title, menu, messages, etc. (Note: messages MUST be displayed AFTER the actions)
$AdminUI->disp_body_top();


// fp> Note: don't bother with T_() yet. This is going to change too often.

if( $blog )
{	// We want to look at a specific blog:
	// Begin payload block:
	$AdminUI->disp_payload_begin();

	echo '<h2>'.$Blog->dget( 'name' ).'</h2>';

	echo '<table class="browse" cellspacing="0" cellpadding="0" border="0"><tr><td>';

	load_class('items/model/_itemlist.class.php');

	$block_item_Widget = & new Widget( 'block_item' );

	$nb_blocks_displayed = 0;

	/*
	 * COMMENTS:
	 */
	$CommentList = & new CommentList( $Blog, "'comment','trackback','pingback'", array( 'draft' ), '',	'',	'DESC',	'',	5 );

	if( $CommentList->result_num_rows )
	{	// We have drafts

		$nb_blocks_displayed++;

		$block_item_Widget->title = T_('Comments awaiting moderation');
		$block_item_Widget->disp_template_replaced( 'block_start' );

		while( $Comment = & $CommentList->get_next() )
		{ // Loop through comments:

			echo '<div class="dashboard_post">';
			echo '<h3 class="dashboard_post_title">';

			switch( $Comment->get( 'type' ) )
			{
				case 'comment': // Display a comment:
					echo T_('Comment from');
					break;

				case 'trackback': // Display a trackback:
					echo T_('Trackback from');
					break;

				case 'pingback': // Display a pingback:
					echo T_('Pingback from');
					break;
			}
			echo ' <strong>';
			$Comment->author();
			echo '</strong>';

			$comment_Item = & $Comment->get_Item();
			echo ' '.T_('in response to')
					.' <a href="?ctrl=items&amp;blog='.$comment_Item->blog_ID.'&amp;p='.$comment_Item->ID.'"><strong>'.$comment_Item->dget('title').'</strong></a>';

			echo '</h3>';

			echo '<div class="notes">';
			if( $Comment->author_url( '', 'Url: <span class="bUrl">', '</span>' ) )
			{
				if( $current_User->check_perm( 'spamblacklist', 'edit' ) )
				{ // There is an URL and we have permission to ban...
					// TODO: really ban the base domain! - not by keyword
					echo ' <a href="'.$dispatcher.'?ctrl=antispam&amp;action=ban&amp;keyword='.rawurlencode(get_ban_domain($Comment->author_url))
						.'">'.get_icon( 'ban' ).'</a> ';
				}
				echo ' &bull; ';
			}
			$Comment->author_email( '', 'Email: <span class="bEmail">', '</span> &bull; ' );
			$Comment->author_ip( 'IP: <span class="bIP">', '</span> &bull; ' );
			$Comment->spam_karma( T_('Spam Karma').': %s%', T_('No Spam Karma') );
			echo '</div>';
		 ?>


		<div class="small">
			<?php $Comment->content() ?>
		</div>

		<div class="dashboard_action_area">
		<?php
			// Display edit button if current user has the rights:
			$Comment->edit_link( ' ', ' ', '#', '#', 'ActionButton');

			// Display publish NOW button if current user has the rights:
			$Comment->publish_link( ' ', ' ', '#', '#', 'PublishButton', '&amp;', true );

			// Display deprecate button if current user has the rights:
			$Comment->deprecate_link( ' ', ' ', '#', '#', 'DeleteButton', '&amp;', true );

			// Display delete button if current user has the rights:
			$Comment->delete_link( ' ', ' ', '#', '#', 'DeleteButton');
		?>
		</div>


		<?php
			echo '</div>';
		}

		$block_item_Widget->disp_template_raw( 'block_end' );
	}


	/*
	 * RECENT DRAFTS
	 */
	// Create empty List:
	$ItemList = & new ItemList2( $Blog, NULL, NULL );

	// Filter list:
	$ItemList->set_filters( array(
			'visibility_array' => array( 'draft' ),
			'orderby' => 'datemodified',
			'order' => 'DESC',
			'posts' => 5,
		) );

	// Get ready for display (runs the query):
	$ItemList->display_init();

	if( $ItemList->result_num_rows )
	{	// We have drafts

		$nb_blocks_displayed++;

		$block_item_Widget->title = T_('Recent drafts');
		$block_item_Widget->disp_template_replaced( 'block_start' );

		while( $Item = & $ItemList->get_item() )
		{
			echo '<div class="dashboard_post" lang="'.$Item->get('locale').'">';
			// We don't switch locales in the backoffice, since we use the user pref anyway
			// Load item's creator user:
			$Item->get_creator_User();

			echo '<div class="dashboard_float_actions">';
			$Item->edit_link( '', '', '#', '#', 'ActionButton' );
			echo ' ';
			$Item->publish_link( '', '', '#', '#', 'PublishButton' );
			echo '</div>';

			echo '<h3 class="dashboard_post_title">';
			echo '<a href="?ctrl=items&amp;blog='.$Blog->ID.'&amp;p='.$Item->ID.'">'.$Item->dget( 'title' ).'</a>';
			echo '</h3>';

			echo '</div>';

		}

		$block_item_Widget->disp_template_raw( 'block_end' );
	}


	/*
	 * RECENTLY EDITED
	 */
	// Create empty List:
	$ItemList = & new ItemList2( $Blog, NULL, NULL );

	// Filter list:
	$ItemList->set_filters( array(
			'visibility_array' => array( 'published', 'protected', 'private', 'deprecated', 'redirected' ),
			'orderby' => 'datemodified',
			'order' => 'DESC',
			'posts' => 5,
		) );

	// Get ready for display (runs the query):
	$ItemList->display_init();

	if( $ItemList->result_num_rows )
	{	// We have recent edits

		$nb_blocks_displayed++;

		$block_item_Widget->title = T_('Recently edited');
		$block_item_Widget->disp_template_replaced( 'block_start' );

		while( $Item = & $ItemList->get_item() )
		{
			echo '<div class="dashboard_post" lang="'.$Item->get('locale').'">';
			// We don't switch locales in the backoffice, since we use the user pref anyway
			// Load item's creator user:
			$Item->get_creator_User();

			echo '<div class="dashboard_float_actions">';
			$Item->edit_link( '', '', '#', '#', 'ActionButton' );
			echo '</div>';

			echo '<h3 class="dashboard_post_title">';
			echo '<a href="?ctrl=items&amp;blog='.$Blog->ID.'&amp;p='.$Item->ID.'">'.$Item->dget( 'title' ).'</a>';
			echo ' <span class="dashboard_post_details">';
			$Item->status();
			echo ' &bull; ';
			$Item->views();
			echo '</span>';
			echo '</h3>';

			// Display images that are linked to this post:
			$Item->images( array(
					'before' =>              '<div class="dashboard_thumbnails">',
					'before_image' =>        '',
					'before_image_legend' => NULL,	// No legend
					'after_image_legend' =>  NULL,
					'after_image' =>         '',
					'after' =>               '</div>',
					'image_size' =>          'fit-80x80'
				) );

			echo '<div class="small">'.$Item->get_content_excerpt( 150 ).'</div>';

			echo '<div style="clear:left;">'.get_icon('pixel').'</div>'; // IE crap
			echo '</div>';
		}

		$block_item_Widget->disp_template_raw( 'block_end' );
	}


	if( $nb_blocks_displayed == 0 )
	{	// We haven't displayed anything yet!

		$nb_blocks_displayed++;

		$block_item_Widget->title = T_('Getting started');
		$block_item_Widget->disp_template_replaced( 'block_start' );

		echo '<p><strong>'.T_('Welcome to your new blog\'s dashboard!').'</strong></p>';

		echo '<p>'.T_('Use the links on the right to write a first post or to customize your blog.').'</p>';

		echo '<p>'.T_('You can see your blog page at any time by clicking "See" in the b2evolution toolbar at the top of this page.').'</p>';

 		echo '<p>'.T_('You can come back here at any time by clicking "Manage" in that same evobar.').'</p>';

		$block_item_Widget->disp_template_raw( 'block_end' );
	}


	/*
	 * DashboardBlogMain to be added here (anyone?)
	 */


	echo '</td><td>';

	/*
	 * RIGHT COL
	 */

	$side_item_Widget = & new Widget( 'side_item' );

	$side_item_Widget->title = T_('Manage your blog');
	$side_item_Widget->disp_template_replaced( 'block_start' );

	echo '<div class="dashboard_sidebar">';
	echo '<ul>';
		echo '<li><a href="admin.php?ctrl=items&amp;action=new&amp;blog='.$Blog->ID.'">Write a new post &raquo;</a></li>';

 		echo '<li>Browse:<ul>';
		echo '<li><a href="admin.php?ctrl=items&tab=full&filter=restore&blog='.$Blog->ID.'">Posts (full) &raquo;</a></li>';
		echo '<li><a href="admin.php?ctrl=items&tab=list&filter=restore&blog='.$Blog->ID.'">Posts (list) &raquo;</a></li>';
		echo '<li><a href="admin.php?ctrl=comments&blog='.$Blog->ID.'">Comments &raquo;</a></li>';
		echo '</ul></li>';

		if( $current_User->check_perm( 'blog_genstatic', 'any', false, $Blog->ID ) )
		{
			echo '<li><a href="admin.php?ctrl=collections&amp;action=GenStatic&amp;blog='.$Blog->ID.'&amp;redir_after_genstatic='.rawurlencode(regenerate_url( '', '', '', '&' )).'">Generate static page!</a></li>';
		}

 		echo '<li><a href="'.$Blog->get('url').'">View this blog</a></li>';
	echo '</ul>';
	echo '</div>';

	$side_item_Widget->disp_template_raw( 'block_end' );

	if( $current_User->check_perm( 'blog_properties', 'edit', false, $Blog->ID ) )
	{
		$side_item_Widget->title = T_('Customize your blog');
		$side_item_Widget->disp_template_replaced( 'block_start' );

		echo '<div class="dashboard_sidebar">';
		echo '<ul>';

		echo '<li><a href="admin.php?ctrl=coll_settings&tab=general&blog='.$Blog->ID.'">'.T_('Blog name').' &raquo;</a></li>';
		echo '<li><a href="admin.php?ctrl=coll_settings&tab=skin&blog='.$Blog->ID.'">'.T_('Blog skin').' &raquo;</a></li>';
		echo '<li><a href="admin.php?ctrl=widgets&blog='.$Blog->ID.'">'.T_('Blog widgets').' &raquo;</a></li>';
		echo '<li><a href="admin.php?ctrl=coll_settings&tab=display&blog='.$Blog->ID.'">'.T_('Blog display order').' &raquo;</a></li>';

		echo '</ul>';
		echo '</div>';

		$side_item_Widget->disp_template_raw( 'block_end' );
	}


	/*
	 * DashboardBlogSide to be added here (anyone?)
	 */


 	echo '</td></tr></table>';


	// End payload block:
	$AdminUI->disp_payload_end();
}
else
{	// We're on the GLOBAL tab...

	$AdminUI->disp_payload_begin();
	echo '<h2>Select a blog</h2>';
	// Display blog list VIEW:
	$AdminUI->disp_view( 'collections/views/_coll_list.view.php' );
	$AdminUI->disp_payload_end();


	/*
	 * DashboardGlobalMain to be added here (anyone?)
	 */
}


/*
 * Administrative tasks
 */

if( $current_User->check_perm( 'options', 'edit' ) )
{	// We have some serious admin privilege:
	// Begin payload block:
	$AdminUI->disp_payload_begin();

	echo '<table class="browse" cellspacing="0" cellpadding="0" border="0"><tr><td>';

	$block_item_Widget = & new Widget( 'block_item' );

	$block_item_Widget->title = T_('Info');
	$block_item_Widget->disp_template_replaced( 'block_start' );

	echo '<p>Please be advised that this is <strong>Alpha</strong> software. Many things may still change.</p>';

 	echo '<p>We especially recommend you wait until next release before investing too much time in porting your skins to the new skin architecture.</p>';

	$block_item_Widget->disp_template_replaced( 'block_end' );

	/*
	 * DashboardAdminMain to be added here (anyone?)
	 */

	echo '</td><td>';

	/*
	 * RIGHT COL
	 */
	$side_item_Widget = & new Widget( 'side_item' );

	$side_item_Widget->title = T_('Administrative tasks');
	$side_item_Widget->disp_template_replaced( 'block_start' );

	echo '<div class="dashboard_sidebar">';
	echo '<ul>';
		if( $current_User->check_perm( 'users', 'edit' ) )
		{
			echo '<li><a href="admin.php?ctrl=users&amp;action=new_user">Create new user &raquo;</a></li>';
		}
		if( $current_User->check_perm( 'blogs', 'create' ) )
		{
			echo '<li><a href="admin.php?ctrl=collections&amp;action=new">Create new blog &raquo;</a></li>';
		}
		echo '<li><a href="admin.php?ctrl=skins">Install a skin &raquo;</a></li>';
		echo '<li><a href="admin.php?ctrl=plugins">Install a plugin &raquo;</a></li>';
		// TODO: remember system date check and only remind every 3 months
		echo '<li><a href="admin.php?ctrl=system">Check system &amp; security &raquo;</a></li>';
	echo '</ul>';
	echo '</div>';

	$side_item_Widget->disp_template_raw( 'block_end' );

	/*
	 * DashboardAdminSide to be added here (anyone?)
	 */

 	echo '</td></tr></table>';

 	// End payload block:
	$AdminUI->disp_payload_end();
}

// Display body bottom, debug info and close </html>:
$AdminUI->disp_global_footer();

/*
 * $Log$
 * Revision 1.8  2007/09/07 20:11:40  fplanque
 * minor
 *
 * Revision 1.7  2007/09/04 22:16:33  fplanque
 * in context editing of posts
 *
 * Revision 1.6  2007/09/04 19:50:04  fplanque
 * dashboard cleanup
 *
 * Revision 1.5  2007/09/04 15:36:07  fplanque
 * minor
 *
 * Revision 1.4  2007/09/03 18:32:50  fplanque
 * enhanced dashboard / comment moderation
 *
 * Revision 1.3  2007/09/03 16:44:31  fplanque
 * chicago admin skin
 *
 * Revision 1.2  2007/06/30 20:37:37  fplanque
 * UI changes
 *
 * Revision 1.1  2007/06/25 10:59:50  fplanque
 * MODULES (refactored MVC)
 *
 * Revision 1.21  2007/06/22 23:46:43  fplanque
 * bug fixes
 *
 * Revision 1.20  2007/06/13 23:29:03  fplanque
 * minor
 *
 * Revision 1.19  2007/06/13 20:56:02  fplanque
 * minor
 *
 * Revision 1.18  2007/05/09 01:01:29  fplanque
 * permissions cleanup
 *
 * Revision 1.17  2007/04/26 00:11:15  fplanque
 * (c) 2007
 *
 * Revision 1.16  2007/03/11 23:57:07  fplanque
 * item editing: allow setting to 'redirected' status
 *
 * Revision 1.15  2007/03/05 04:48:15  fplanque
 * IE crap
 *
 * Revision 1.14  2007/03/05 02:13:25  fplanque
 * improved dashboard
 *
 * Revision 1.13  2007/01/28 23:31:57  blueyed
 * todo
 *
 * Revision 1.12  2007/01/19 08:20:57  fplanque
 * bugfix
 *
 * Revision 1.11  2007/01/14 22:43:29  fplanque
 * handled blog view perms.
 *
 * Revision 1.10  2006/12/17 02:42:22  fplanque
 * streamlined access to blog settings
 *
 * Revision 1.9  2006/12/15 22:53:26  fplanque
 * cleanup
 *
 * Revision 1.8  2006/12/12 21:19:31  fplanque
 * UI fixes
 *
 * Revision 1.7  2006/12/12 02:53:56  fplanque
 * Activated new item/comments controllers + new editing navigation
 * Some things are unfinished yet. Other things may need more testing.
 *
 * Revision 1.6  2006/12/11 17:26:21  fplanque
 * some cross-linking
 *
 * Revision 1.5  2006/12/09 02:01:48  fplanque
 * temporary / minor
 *
 * Revision 1.4  2006/12/07 23:59:31  fplanque
 * basic dashboard stuff
 *
 * Revision 1.3  2006/12/07 23:21:00  fplanque
 * dashboard blog switching
 *
 * Revision 1.2  2006/12/07 23:13:10  fplanque
 * @var needs to have only one argument: the variable type
 * Otherwise, I can't code!
 *
 * Revision 1.1  2006/12/07 22:29:26  fplanque
 * reorganized menus / basic dashboard
 *
 */
?>